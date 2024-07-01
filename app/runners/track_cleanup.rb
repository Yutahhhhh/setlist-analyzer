# frozen_string_literal: true

# bundle exec rails r TrackCleanup.apply

class TrackCleanup
  def self.apply
    Track.where.not(md5: nil)
         .group(:md5)
         .having('count(*) > 1')
         .pluck(:md5)
         .each do |md5|
      # 一番最初のレコード以外を削除
      tracks_to_remove = Track.where(md5:).offset(1)
      Rails.logger.info("Removing #{tracks_to_remove.count} duplicate tracks for MD5: #{md5}")
      tracks_to_remove.destroy_all
    end
  end
end
