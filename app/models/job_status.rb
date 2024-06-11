# frozen_string_literal: true

# == Schema Information
#
# Table name: job_statuses
#
#  id                                                    :bigint           not null, primary key
#  finished_at(終了時刻)                                 :datetime
#  job_type(0: 指定なし, 10: 音楽ジャンル, 20: 音楽解析) :integer          default("audio_genre_train"), not null
#  message(メッセージ（エラーメッセージや進捗など）)     :text(65535)
#  progress(進捗)                                        :integer          default(0), not null
#  result(結果や出力内容)                                :text(65535)
#  retry_count(再試行回数)                               :integer          default(0)
#  started_at(開始時刻)                                  :datetime
#  status(0: 実行中, 1: 完了, 2: 失敗)                   :integer          default("running"), not null
#  created_at                                            :datetime         not null
#  updated_at                                            :datetime         not null
#  job_id(一意の識別子)                                  :string(255)      not null
#  user_id(起動したユーザーのID)                         :bigint
#
# Indexes
#
#  index_job_statuses_on_job_id   (job_id) UNIQUE
#  index_job_statuses_on_user_id  (user_id)
#
class JobStatus < ApplicationRecord
  belongs_to :user
  enum status: { running: 0, completed: 1, failed: 2 }
  enum job_type: { not_specified: 0, audio_genre_train: 10, audio_analyze: 20 }
  validates :job_id, presence: true, uniqueness: { case_sensitive: false }
end
