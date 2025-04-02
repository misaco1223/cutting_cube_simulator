class User < ApplicationRecord
  has_secure_password
  has_many :cut_cubes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :boards, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, confirmation: true, presence: true 
end
