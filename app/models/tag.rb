class Tag < ApplicationRecord
  has_many :board_tags, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
