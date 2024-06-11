# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::AudiosController, type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) do
    # Devise Token Authの場合、ヘッダには`access-token`、`client`、`uid`が必要なので、リクエストごとに含める
    user.create_new_auth_token
  end
  let(:mp3_length) { 5 }
  let(:wav_length) { 5 }
  let(:flac_length) { 5 }
  let(:m4a_length) { 5 }
  let!(:audio_files) do
    # m4aはサポートされていない
    create(:audio_fetch, :custom_files, file_specs: [
      (1..mp3_length).map { |i| { path: "test#{i}", ext: 'mp3' } },
      (1..wav_length).map { |i| { path: "test#{i}", ext: 'wav' } },
      (1..flac_length).map { |i| { path: "test#{i}", ext: 'flac' } },
      (1..m4a_length).map { |i| { path: "test#{i}", ext: 'm4a' } }
    ].flatten)
  end
  let(:search_params) do
    {
      page: 1,
      per: 10,
      filename: '',
      extensions: '',
      is_all_tracks: false
    }
  end

  describe 'GET #index' do
    after do
      # テスト後にファイルを削除する
      audio_files.each_value do |filepath|
        FileUtils.rm(filepath) if File.exist?(filepath)
      end
    end

    it '正常なレスポンスが返されること' do
      get api_audios_url, params: search_params, headers: auth_headers
      JSON.parse(response.body)
      expect(response).to have_http_status(:ok)
    end

    it 'オーディオファイルが正しくページネーションされていること' do
      get api_audios_url, params: search_params, headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['tracks'].length).to eq(10)
      expect(actual['totalItemCount']).to eq(mp3_length + wav_length + flac_length)
      expect(actual['totalPages']).to eq(2)
      expect(actual['currentPage']).to eq(1)

      get api_audios_url, params: search_params.merge(page: 2), headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['tracks'].length).to eq(5)
    end

    it '指定されたファイル名でファイルがフィルタリングされること' do
      get api_audios_url, params: search_params.merge(filename: 'test1'), headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['tracks'].length).to eq(3)
    end

    it '`is_all_tracks`がfalseの場合、ユーザーに関連付けられているトラックが除外されること' do
      create(:track, path: audio_files.values.first, user:)
      get api_audios_url, params: search_params.merge(per: 20), headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['tracks'].length).to eq((mp3_length + wav_length + flac_length) - 1)
    end

    it 'サポートされていない拡張子（m4a）のファイルが除外されること' do
      get api_audios_url, params: search_params.merge(extensions: 'm4a'), headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual['tracks'].length).to eq(0)
    end
  end
end
