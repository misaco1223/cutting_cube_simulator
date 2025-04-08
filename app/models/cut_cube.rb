class CutCube < ApplicationRecord
  belongs_to :user, optional: true
  validates :cut_id, presence: true
  validates :cut_points, presence: true
  validates :glb_file_name, presence: true

  has_one_attached :gltf_file
  validates :gltf_file, presence: true

  has_many :bookmarks, dependent: :destroy
  has_many :boards, dependent: :destroy

  def self.delete_expired_guest_data
    where(user_id: nil)
      .where("cookie_id IS NULL AND created_at < ?", 1.day.ago)
      .find_each(batch_size: 1000) do |record|
        ActiveRecord::Base.transaction do
          if record.gltf_file.attached?
            record.gltf_file.purge
            ActiveStorage::Attachment.where(record: record).destroy_all
          end
          record.destroy
        end
      end
  end

  def self.find_by_user_or_cookie(user, cookie_id, id)
    if user.present?
      user.cut_cubes.find_by(id: id)
    elsif cookie_id.present?
      CutCube.find_by(id: id, cookie_id: cookie_id)
    end
  end

  def self.owned_by_user_or_cookie(user, cookie_id)
    return user.cut_cubes.order(created_at: :desc) if user
    where(cookie_id: cookie_id).order(created_at: :desc)
  end

  def bookmark_id_for(user)
    return nil unless user
    bookmarks.find_by(user_id: user.id)&.id
  end
end