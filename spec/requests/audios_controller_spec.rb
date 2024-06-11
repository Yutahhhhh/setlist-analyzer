# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AudiosController, type: :request do
  describe 'GET #find_audio' do
    let(:target_path) { 'spec/fixtures/audios/test.mp3' }

    it '正常なレスポンスが返されること' do
      create(:audio_fetch, :add)
      get audios_find_audio_path, params: { path: target_path }
      expect(response).to have_http_status(:ok)

      FileUtils.rm(target_path)
    end

    it 'ファイルが存在しない場合、エラーが返されること' do
      get audios_find_audio_path, params: { path: target_path }
      expect(response).to have_http_status(:not_found)
    end
  end
end
