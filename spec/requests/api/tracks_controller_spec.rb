# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::TracksController, type: :request do
  let(:user) { create(:user) }
  let!(:mp3_tracks) { create_list(:track, 5, user:, file_prefix: 'file_mp3', extension: 'mp3') }
  let!(:wav_tracks) { create_list(:track, 5, user:, file_prefix: 'file_wav', extension: 'wav') }
  let!(:flac_tracks) { create_list(:track, 2, user:, file_prefix: 'file_flac', extension: 'flac') }
  let(:auth_headers) do
    # Devise Token Authの場合、ヘッダには`access-token`、`client`、`uid`が必要なので、リクエストごとに含める
    user.create_new_auth_token
  end

  describe 'GET #index' do
    let(:search_params) { { page: 1, per: 10, filename: '', extensions: '' } }

    it '正常なレスポンスが返されること' do
      get api_tracks_url, params: search_params, headers: auth_headers
      expect(response).to be_successful
    end

    it '正しくページネーションされていること' do
      get api_tracks_url, params: search_params, headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['tracks'].length).to eq(10)
      expect(actual['totalPages']).to eq(2)
      expect(actual['currentPage']).to eq(1)
    end

    it '指定されたファイル名でフィルタリングされていること' do
      get api_tracks_url, params: search_params.merge(filename: 'file_mp3'), headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['totalItemCount']).to eq(mp3_tracks.count)
    end

    it '指定された拡張子でフィルタリングされていること' do
      get api_tracks_url, params: search_params.merge(extensions: '.mp3'), headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['totalItemCount']).to eq(mp3_tracks.count)
    end
  end

  describe 'POST #analyze' do
    let(:analyze_params) { { filename: '', extensions: '', is_all_tracks: false } }
    let!(:audio_files) do
      # m4aはサポートされていない
      FactoryBot.create(:audio_fetch, :custom_files, file_specs: [
        (1..5).map { |i| { path: "file_mp3_#{i}", ext: 'mp3' } },
        (1..5).map { |i| { path: "file_wav_#{i}", ext: 'wav' } }
      ].flatten)
    end

    before do
      allow(AudioAnalyzeJob).to receive(:perform_async)
      Dir.glob(Rails.root.join('spec/fixtures/audios/*.mp3').to_s).each do |file|
        create(:track, user:, path: file, file_prefix: 'file_mp3', extension: 'mp3')
      end
    end

    after do
      # テスト後にファイルを削除する
      audio_files.each_value do |filepath|
        FileUtils.rm(filepath) if File.exist?(filepath)
      end
    end

    it '正常なレスポンスが返されること' do
      post analyze_api_tracks_path, params: { analyze: analyze_params }, headers: auth_headers
      expect(response).to have_http_status(:ok)
      actual = JSON.parse(response.body)
      expect(actual['status']).to eq('running')
    end

    it '指定されたファイル名でフィルタリングされていること' do
      post analyze_api_tracks_path, params: { analyze: analyze_params.merge(filename: 'file_mp3') },
                                    headers: auth_headers
      expect(response).to have_http_status(:ok)
      actual = JSON.parse(response.body)
      expect(actual['status']).to eq('running')
      expect(AudioAnalyzeJob).to have_received(:perform_async).with(result_files('.mp3'), actual['id'], false)
    end

    it '指定された拡張子でフィルタリングされていること' do
      post analyze_api_tracks_path, params: { analyze: analyze_params.merge(extensions: '.mp3') }, headers: auth_headers
      expect(response).to have_http_status(:ok)
      actual = JSON.parse(response.body)
      expect(actual['status']).to eq('running')
      expect(AudioAnalyzeJob).to have_received(:perform_async).with(result_files('.mp3'), actual['id'], false)
    end

    it '`is_all_tracks`がtrueの場合、ユーザーに関連付けられているトラックが除外されないこと' do
      post analyze_api_tracks_path, params: { analyze: analyze_params.merge(is_all_tracks: true) },
                                    headers: auth_headers
      expect(response).to have_http_status(:ok)
      actual = JSON.parse(response.body)
      expect(actual['status']).to eq('running')
      expect(AudioAnalyzeJob).to have_received(:perform_async).with(result_files, actual['id'], true)
    end

    def result_files(ext = nil)
      Dir.glob(Rails.root.join("spec/fixtures/audios/*#{ext}").to_s).map do |file_path|
        Pathname.new(file_path).relative_path_from(Rails.root).to_s
      end
    end
  end
end
