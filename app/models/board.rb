class Board < ApplicationRecord
  belongs_to :user
  belongs_to :cut_cube

  validates :question, presence: true
  validates :answer, presence: true
  validate :must_own_cut_cube

  def must_own_cut_cube
    errors.add(:user_id, "自分のCutCubeしかブックマークできません") if cut_cube.user_id != user_id
  end
end
