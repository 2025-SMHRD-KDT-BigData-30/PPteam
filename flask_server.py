from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from requests.adapters import HTTPAdapter, Retry
import base64
import json
from collections import defaultdict, Counter
from eunjeon import Mecab  # mecab-ko-dic이 설치되어 있어야 함
import re
from sklearn.feature_extraction.text import TfidfVectorizer


# Flask 앱 생성 및 CORS 설정
app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*") # 모든 origin 허용

# ✅ 불용어 정의
stopwords = set([
    '것', '등', '수', '이상', '이하', '중', '때', '및', '의', '를', '을', '에', '이', '가',
    '에서', '이다', '하는', '하지', '같은', '또는', '그리고', '로', '된다', '된', '하여',
    '그', '이런', '저런', '있는', '없는', '위한', '대한', '→', '.', '·', '중', '후', '전', '번',
    '한', '두', '세', '네', '또', '다시', '더', '좀', '막', '또한', '해서', '하자', '되며', '되었고',
    '되어', '되기', '있다', '없다', '같다', '되다', '정도', '경우', '사실', '내용', '문제', '따라',
    '위해', '통해', '보면', '가지고', '요', '네', '죠', '야', '게', '은', '는', '도', '와', '으로', '까지'
])

mecab = Mecab() # 형태소 분석기 초기화

# Clova OCR API 정보
API_URL = 'https://cj86k2oxlt.apigw.ntruss.com/custom/v1/40301/ec01e5ba5d65e27f04e7a1d201a6695f47626a4be010f53d2ecfdc0ef5554942/general'
SECRET_KEY = 'REVDdlh5R0VEU0FVdVlrWHpZdmhRVk1kU2d5amZyeHo='

# OCR 처리 엔드포인트
@app.route("/ocr", methods=["POST"])
def handle_ocr():
    try:
        # React에서 전달한 이미지 파일 수신
        image = request.files["image"]
        filename = image.filename
        ext = filename.rsplit('.', 1)[-1].lower()
        image_data = base64.b64encode(image.read()).decode('utf-8')

        # Clova OCR API 호출을 위한 요청 구성
        headers = {
            'Content-Type': 'application/json',
            'X-OCR-SECRET': SECRET_KEY
        }
        payload = {
            'version': 'V2',
            'requestId': 'sample_request',
            'timestamp': 0,
            'images': [{
                'name': 'uploaded_image',
                'format': ext,
                'data': image_data
            }]
        }

        # OCR API에 요청 (3회 재시도 설정)
        session = requests.Session()
        adapter = HTTPAdapter(max_retries=Retry(total=3, status_forcelist=[429, 500, 502, 503, 504]))
        session.mount('https://', adapter)
        response = session.post(API_URL, headers=headers, data=json.dumps(payload), verify=False)
        res = response.json()
        print("OCR 응답:", json.dumps(res, indent=2, ensure_ascii=False))

        # 필드에서 유효한 텍스트만 필터링
        fields = res['images'][0].get('fields', [])
        fields = [f for f in fields if f['boundingPoly']['vertices'][0]['y'] > 60 and all(k not in f['inferText'].upper() for k in ['PAGE', 'DATE'])]


        # 텍스트 라인 정렬 작업
        lines_dict = defaultdict(list)
        for field in fields:
            y = field['boundingPoly']['vertices'][0]['y']
            y_group = int(round(y / 10.0)) * 10
            lines_dict[y_group].append(field)

        sorted_lines = []
        for key in sorted(lines_dict.keys()):
            line_fields = sorted(lines_dict[key], key=lambda x: x['boundingPoly']['vertices'][0]['x'])
            line_text = " ".join(f['inferText'] for f in line_fields)
            if "PAGE" not in line_text.upper() and "DATE" not in line_text.upper():
                sorted_lines.append(line_text)

        # 최종 텍스트 결과 조합
        result_text = " ".join(sorted_lines)
        result_text = re.sub(r"\b(PAGE|DATE)\b", "", result_text, flags=re.IGNORECASE).strip()

        
        merge_phrases = {
            "유스 케이스": "유스케이스", "시퀀스 다이어그램": "시퀀스다이어그램",
            "활동 다이어그램": "활동다이어그램", "클래스 다이어그램": "클래스다이어그램",
            "요구 사항": "요구사항", "정보 시스템": "정보시스템",
            "데이터 흐름도": "데이터흐름도", "엔터티 관계도": "엔터티관계도",
            "정규 화": "정규화", "함수 종속": "함수종속", "소프트웨어 생명 주기": "소프트웨어생명주기"
        }
        for wrong, right in merge_phrases.items():
            result_text = result_text.replace(wrong, right)

        nouns = mecab.nouns(result_text)
        filtered = [word for word in nouns if word not in stopwords and len(word) > 1]

        fixed_keywords = [
            "라우팅","애자일","유스케이스", "유스케이스다이어그램", "시퀀스다이어그램", "활동다이어그램", "클래스다이어그램",
            "상태다이어그램", "패키지다이어그램", "객체다이어그램", "컴포넌트다이어그램", "배치다이어그램",
            "기능요구사항", "비기능요구사항", "정보시스템", "데이터흐름도", "엔터티관계도", "데이터사전",
            "데이터모델링", "관계형데이터베이스", "정규화", "함수종속", "부분함수종속", "이행적함수종속",
            "트랜잭션처리", "병행제어", "로킹기법", "낙관적기법", "타임스탬프기법", "프로그래밍언어",
            "운영체제", "시분할시스템", "실시간시스템", "정보은닉", "캡슐화", "상속성", "다형성",
            "소프트웨어생명주기", "폭포수모형", "프로토타이핑모델", "나선형모델", "애자일모델"
        ]
        for word in fixed_keywords:
            if word in result_text and word not in filtered:
                filtered.append(word)

        info_process_keywords = set([
            "라우팅","애자일","요구사항", "요구사항분석", "소프트웨어", "소프트웨어설계", "소프트웨어공학", "모델링",
            "분석", "데이터흐름도", "DFD", "ERD", "개념모델링", "논리모델링", "물리모델링", "데이터모델링",
            "객체지향", "캡슐화", "상속", "다형성", "정규화", "함수종속", "부분함수종속", "이행적함수종속",
            "트랜잭션", "병행제어", "로킹", "낙관적기법", "타임스탬프기법", "시스템", "프로세스", "요소",
            "단계", "절차", "개념", "활동다이어그램", "클래스다이어그램", "유스케이스", "패키지다이어그램",
            "컴포넌트다이어그램", "배치다이어그램", "정보시스템", "정형기법", "명세서", "개발", "도메인",
            "정의", "추상화", "구체화", "시퀀스다이어그램", "상태다이어그램", "설계", "데이터", "정보은닉"
        ])

        important_nouns = [word for word in filtered if word in info_process_keywords]

        # 공백으로 붙여서 한 문장처럼 만들기
        doc = " ".join(important_nouns)

        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform([doc])

        tfidf_scores = dict(zip(vectorizer.get_feature_names_out(), X.toarray()[0]))

        # 점수 높은 상위 5개 추출
        top_5_keywords = sorted(tfidf_scores, key=tfidf_scores.get, reverse=True)[:5]

        print("📄 최종 OCR 텍스트:\n", result_text)
        print("📌 최종 키워드 리스트:\n", top_5_keywords)

        #JSON 형태로 React에 전달
        return jsonify({
            "ocr_text": result_text,
            "ocr_keyword": top_5_keywords
        })

    except Exception as e:
        print("❌ Flask 처리 중 오류:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True, use_reloader=False)
