class User < ApplicationRecord
  has_secure_password
  has_many :cut_cubes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :boards, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_boards, -> { select('boards.*, likes.created_at as liked_at').order('likes.created_at DESC')}, through: :likes, source: :board
  has_many :favorites, dependent: :destroy
  has_many :favorited_boards, -> { select('boards.*, favorites.created_at as favorited_at').order('favorites.created_at DESC')}, through: :favorites, source: :board


  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, confirmation: true, presence: true, if: :password_required?

  def password_required?
    new_record? || password.present?
  end
end
