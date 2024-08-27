import json

from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
import base64

app = Flask(__name__)

# 初始化 OCR 对象
ocr = PaddleOCR(use_angle_cls=True, lang='ch')


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

        # 执行 OCR 识别
        result = ocr.ocr(img, cls=True)

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
        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
