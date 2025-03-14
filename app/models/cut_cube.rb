class CutCube < ApplicationRecord
  belongs_to :user, optional: true
  validates :cut_id, presence: true
  validates :cut_points, presence: true
  validates :glb_file_name, presence: true

  has_one_attached :gltf_file
  validates :gltf_file, presence: true
end