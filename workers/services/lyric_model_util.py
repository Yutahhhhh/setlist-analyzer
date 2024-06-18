import whisper
import MeCab

def initialize_mecab():
    return MeCab.Tagger("-Ochasen")

def initialize_whisper_model():
    model = whisper.load_model("base")
    return model

def audio_to_text(model, file_path):
    result = model.transcribe(file_path, verbose=True)
    return result

def extract_phrases_with_mecab(text):
    tagger = initialize_mecab()
    node = tagger.parseToNode(text)
    phrases = []
    
    while node:
        features = node.feature.split(',')
        word_type = features[0]
        if word_type == '名詞' and features[1] == '一般':
            phrases.append((node.surface, 'NOUN'))
        elif word_type == '動詞' and features[6] != '*':
            phrases.append((features[6], 'VERB'))
        node = node.next
    
    return phrases

def find_phrase_times(segments, phrases):
    segments = filter_repeated_phrases(segments)
    times = []
    for segment in segments:
        segment_text = segment.get('text', '').lower()
        for phrase, type in phrases:
            if phrase.lower() in segment_text:
                start = segment.get('start', 0)
                end = segment.get('end', 0)
                times.append({
                    "phrase": phrase,
                    "type": type,
                    "start": start,
                    "end": end
                })
    return times

# 短時間で繰り返される単語をフィルタリング（ノイズが原因で発生する場合がある）
def filter_repeated_phrases(phrases, min_interval=0.5):
    if not phrases:
        return []

    # 最初のフレーズを結果リストに追加
    filtered_phrases = [phrases[0]]
    for current_phrase in phrases[1:]:
        last_phrase = filtered_phrases[-1]
        
        # 重複を避けるために、最後に追加されたフレーズの終了時間と次のフレーズの開始時間を比較
        if current_phrase['start'] - last_phrase['end'] >= min_interval:
            filtered_phrases.append(current_phrase)

    return filtered_phrases