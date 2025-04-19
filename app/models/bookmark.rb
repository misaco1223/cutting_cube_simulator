class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :cut_cube

  validates :user_id, uniqueness: { scope: :cut_cube_id, message: "このブックマークは既に登録されています。" }
  validate :must_own_cut_cube

  def must_own_cut_cube
    errors.add(:user_id, "自分のCutCubeしかブックマークできません") if cut_cube.user_id != user_id
  end
end
