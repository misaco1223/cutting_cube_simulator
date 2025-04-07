class Board < ApplicationRecord
  belongs_to :user
  belongs_to :cut_cube

  has_many :board_tags, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :favorites, dependent: :destroy

  validates :user_id, presence: true
  validates :cut_cube_id, presence: true
  validates :question, presence: true
  validates :answer, presence: true
  validate :must_own_cut_cube

  def must_own_cut_cube
    errors.add(:user_id, "自分のCutCubeしかブックマークできません") if cut_cube.user_id != user_id
  end
end
