# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::JobStatusesController, type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) do
    # Devise Token Authの場合、ヘッダには`access-token`、`client`、`uid`が必要なので、リクエストごとに含める
    user.create_new_auth_token
  end
  let!(:job_statuses) { create_list(:job_status, 3, user:) }

  describe 'GET #index' do
    before do
      # WorkerGenreServiceのモックを作成
      allow(WorkerGenreService).to receive(:get_genres).with(user.id).and_return(%w[Pop Jazz Classical])
    end

    it '正常なレスポンスが返されること' do
      get api_job_statuses_path, headers: auth_headers
      actual = JSON.parse(response.body)
      expect(response).to have_http_status(:ok)

      # 降順で取得されていることを確認
      expected_job_ids = user.job_statuses.order(created_at: :desc).pluck(:id)
      returned_job_ids = actual.map { |ac| ac['id'] }
      expect(returned_job_ids).to eq(expected_job_ids)
    end
  end
end
