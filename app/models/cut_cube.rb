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
end