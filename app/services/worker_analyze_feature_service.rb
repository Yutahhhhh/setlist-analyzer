# frozen_string_literal: true

class WorkerAnalyzeFeatureService < WorkerService
  def self.start_analyze(file_paths, user_id)
    headers = { 'Content-Type' => 'application/json' }
    body = { file_paths:, user_id: }.to_json
    # 1本のリクエストに3分以上かかる場合、timeoutを180以上に設定
    response = post('/workers/features/analyze', body:, headers:, timeout: 180)
    raise WorkerServiceError, "解析に失敗しました: #{response.code} - #{response.message}" unless response.ok?

    res = response.parsed_response
    handle_response(res)
    response_format(res)
  end

  def self.response_format(data)
    data.deep_symbolize_keys[:results].map do |result|
      {
        file_path: result[:file_path] || '',
        metadata: result[:metadata] || {},
        features: result[:features] || {}
      }
    end
  end

  def self.handle_response(response)
    Rails.logger.debug "結果: #{response['results']}"
  end
end
