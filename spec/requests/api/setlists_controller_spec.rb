# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::SetlistsController, type: :request do
  let(:user) { create(:user) }
  let!(:setlists) { create_list(:setlist, 3, :with_tracks, user:) }
  let(:auth_headers) do
    # Devise Token Authの場合、ヘッダには`access-token`、`client`、`uid`が必要なので、リクエストごとに含める
    user.create_new_auth_token
  end

  describe 'GET #index' do
    it '正常なレスポンスが返されること' do
      get api_setlists_url, headers: auth_headers
      expect(response).to be_successful
    end

    it 'セットリストを正しく取得すること' do
      get api_setlists_url, headers: auth_headers
      actual = JSON.parse(response.body)
      expect(actual.length).to eq(3)
      actual.first.tap do |setlist|
        expect(setlist['name']).to eq('My Awesome Setlist')
        expect(setlist['genreName']).to eq('Rock')
        expect(setlist['rating']).to eq(3)
        expect(setlist['tracks'].length).to eq(setlists.first.tracks.length)
        expect(setlist['tracks'].map { |t| t['playOrder'] }).to eq([1, 2, 3])
      end
    end
  end

  describe 'GET #show' do
    it '正常なレスポンスが返されること' do
      get api_setlist_url(setlists.first.id), headers: auth_headers
      expect(response).to be_successful
    end

    it '指定されたセットリストを正しく取得すること' do
      get api_setlist_url(setlists.first.id), headers: auth_headers
      expect(response).to have_http_status(:ok)
      actual = JSON.parse(response.body)
      expect(actual['name']).to eq(setlists.first.name)
    end
  end

  describe 'POST #create' do
    let(:setlist_params) do
      tracks = create_list(:track, 2, user:)
      {
        setlist: {
          name: 'New Setlist',
          genre_name: 'Rock',
          rating: 3,
          setlist_tracks_attributes: tracks.map.with_index do |track, i|
            { track_id: track.id, play_order: i + 1 }
          end
        }
      }
    end

    it '新しいセットリストを作成できること' do
      expect do
        post api_setlists_url, params: setlist_params, headers: auth_headers
      end.to change(Setlist, :count).by(1)
      expect(response).to have_http_status(:ok)
    end

    it '無効なパラメータでエラーを返すこと' do
      post api_setlists_url, params: { setlist: { name: '' } }, headers: auth_headers
      expect(response).to have_http_status(:bad_request)
    end
  end

  describe 'PUT #update' do
    let(:setlist_params) do
      {
        setlist: {
          name: 'Updated Name'
        }
      }
    end

    it 'セットリストを更新できること' do
      put api_setlist_url(setlists.first.id), params: setlist_params, headers: auth_headers
      expect(response).to have_http_status(:ok)
      expect(setlists.first.reload.name).to eq('Updated Name')
    end

    it '無効なパラメータで更新できないこと' do
      put api_setlist_url(setlists.first.id), params: { setlist: { name: '' } }, headers: auth_headers
      expect(response).to have_http_status(:bad_request)
    end
  end

  describe 'DELETE #destroy' do
    it 'セットリストを削除できること' do
      expect do
        delete api_setlist_url(setlists.first.id), headers: auth_headers
      end.to change(Setlist, :count).by(-1)
      expect(response).to have_http_status(:ok)
    end
  end
end
