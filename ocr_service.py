import gc
import json
import os
from datetime import datetime

import cv2
import numpy as np
from PIL import Image
from io import BytesIO

from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
import base64

app = Flask(__name__)

# 初始化 OCR 对象
ocr = {
    'ch': PaddleOCR(use_angle_cls=True, lang='ch'),
    'en': PaddleOCR(use_angle_cls=True, lang='en')
}

@app.route('/ocr', methods=['POST'])
def ocr_service():
    try:
        # 确保接收到的内容是 JSON 格式的字典
        data = request.get_json()  # 直接获取原始数据作为字符串
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        data_v = json.loads(data)

        # 从字典中获取图像的 Base64 编码数据
        img_data = data_v.get("image")
        if not img_data:
            return jsonify({"error": "No image data provided"}), 400

        # print("接收到的图片数据长度:", img_data)

        # 解码 Base64 编码的图像数据
        img = base64.b64decode(img_data)

        # 从 JSON 数据中获取 "save" 字段
        save_file = data_v.get("save", False)

        # 如果 save 为 True，保存图片
        if save_file:
            # 使用当前时间戳作为文件名
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            img_filename = os.path.join("image", f"{timestamp}.png")

            # 将图像保存到 'image' 文件夹中
            with open(img_filename, "wb") as f:
                f.write(img)

        # 获取语言参数，默认为 'ch'
        lang = data_v.get("lang", "ch")
        ocr_instance = ocr.get(lang, ocr['ch'])

        # 根据传递的语言参数重新初始化 OCR 对象
        # global ocr
        # ocr = PaddleOCR(use_angle_cls=True, lang=lang)

        # 执行 OCR 识别
        result = ocr_instance.ocr(img, cls=True)

        response = []
        if isinstance(result, list):
            for result_list in result:
                if isinstance(result_list, list):
                    for line in result_list:
                        if isinstance(line, list) and len(line) == 2:
                            box = line[0]
                            text_info = line[1]
                            if isinstance(text_info, tuple) and len(text_info) == 2:
                                text, confidence = text_info
                                response.append({
                                    'text': text,
                                    'confidence': confidence,
                                    'box': box
                                })
        print("response: ", response)
        # 如果没有识别到任何字，则返回 null
        # 手动清理内存
        del img_data, img, result, result_list
        # 仅在这些变量已定义的情况下删除它们
        if 'line' in locals():
            del line
        if 'box' in locals():
            del box
        if 'text_info' in locals():
            del text_info
        gc.collect()  # 强制进行垃圾回收
        if not response:
            return jsonify(None), 200
        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/color', methods=['POST'])
def color_recognition():
    try:
        # 获取 JSON 数据
        data = request.get_json()
        data_v = json.loads(data)
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        # 从字典中获取图像的 Base64 编码数据
        img_data = data_v.get("image")
        if not img_data:
            return jsonify({"error": "No image data provided"}), 400

        # 解码 Base64 编码的图像数据
        img = base64.b64decode(img_data)
        image = Image.open(BytesIO(img))

        # 获取特定位置的颜色，默认为图像中心
        width, height = image.size
        x = data_v.get("x", width // 2)
        y = data_v.get("y", height // 2)

        # 获取指定像素的颜色
        color = image.getpixel((x, y))

        # 将 RGB 值转换为 16 进制颜色代码
        hex_color = '#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2])


        # 手动清理不再使用的变量
        del img_data, img, image, color
        gc.collect()  # 强制进行垃圾回收

        # 返回颜色的 RGB 值和 16 进制颜色代码
        return jsonify({
            "hex": hex_color
        })

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


def is_pixel_blue(r, g, b):
    hsv = cv2.cvtColor(np.uint8([[[b, g, r]]]), cv2.COLOR_BGR2HSV)[0][0]
    h, s, v = hsv
    # 将色相范围缩小，更严格地检测蓝色
    return 110 <= h <= 130 and s > 0.5 and v > 0.5


def is_image_mostly_blue(image):
    np_image = np.array(image)
    height, width, _ = np_image.shape
    total_pixels = height * width

    blue_pixels = 0
    for row in np_image:
        for pixel in row:
            r, g, b = pixel[:3]  # 只解包前3个值
            if is_pixel_blue(r, g, b):
                blue_pixels += 1

    blue_percentage = blue_pixels / total_pixels
    # print(f"Total Pixels: {total_pixels}, Blue Pixels: {blue_pixels}, Blue Percentage: {blue_percentage}")  # 调试信息
    # 清理 NumPy 数组，避免占用大量内存
    del np_image, row, pixel,height,width
    gc.collect()  # 强制进行垃圾回收

    return blue_percentage > 0.58


@app.route('/is_blue', methods=['POST'])
def color_is_blue():
    try:
        # 获取 JSON 数据
        data = request.get_json()
        data_v = json.loads(data)
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        # 从字典中获取图像的 Base64 编码数据
        img_data = data_v.get("image")
        if not img_data:
            return jsonify({"error": "No image data provided"}), 400

        # 解码 Base64 编码的图像数据
        img = base64.b64decode(img_data)
        image = Image.open(BytesIO(img))

        # # 从 JSON 数据中获取 "save" 字段
        # save_file = data_v.get("save", False)
        #
        # # 如果 save 为 True，保存图片
        # if save_file:
        #     # 使用当前时间戳作为文件名
        #     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        #     img_filename = os.path.join("image", f"{timestamp}.png")
        #
        #     # 将图像保存到 'image' 文件夹中
        #     with open(img_filename, "wb") as f:
        #         f.write(img)

        # 判断图像是否大部分区域偏蓝
        mostly_blue = is_image_mostly_blue(image)

        # 清理 PIL Image 对象
        del data,img, image
        gc.collect()  # 强制进行垃圾回收

        print("是否大部分区域偏蓝", mostly_blue)
        # 返回结果
        return jsonify({
            "mostly_blue": bool(mostly_blue)
        })

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
