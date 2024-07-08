# frozen_string_literal: true

class WorkerAnalyzeLyricService < WorkerService
  read_timeout 600

  def self.start_analyze(file_path)
    headers = { 'Content-Type' => 'application/json' }
    body = { file_path: }.to_json

    start_time = Time.zone.now
    response = post('/workers/lyrics/analyze', body:, headers:, timeout: 600)

    # 時間計測終了
    end_time = Time.zone.now
    duration = end_time - start_time
    Rails.logger.debug "処理時間: #{duration}秒"
    raise WorkerServiceError, "解析に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    res = response.parsed_response
    handle_response(res)
    response_format(res)
  end

  def self.response_format(data)
    {
      phrases: data.deep_symbolize_keys[:phrases] || [],
      lyrics: data['lyrics'] || ''
    }
  end

  def self.handle_response(response)
    Rails.logger.debug "結果: phrases: #{response['phrases']}, lyrics: #{response['lyrics']}"
  end
end
