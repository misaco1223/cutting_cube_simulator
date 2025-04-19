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

  scope :with_associations, -> {
    joins(:user, :cut_cube)
    .includes(:likes, :favorites, board_tags: :tag)
  }

  scope :is_published, -> { where(published: true)}

  scope :with_tag, ->(tag_id) {
    joins(board_tags: :tag).where(board_tags: { tag_id: tag_id })
  }

  scope :popular, -> {
    joins(:likes)
    .group('boards.id')
    .select('boards.*, COUNT(likes.id) AS likes_count')
    .order('likes_count DESC')
  }

  def user_name
    user.name
  end

  def cut_points_json
    JSON.parse(cut_cube.cut_points)
  end

  def tag_names
    board_tags.includes(:tag).sort_by { |bt| bt.tag.id }.map { |bt| bt.tag.name }
  end

  def liked_by?(user)
    user.likes.exists?(board_id: self.id)
  end

  def favorited_by?(user)
    user.favorites.exists?(board_id: self.id)
  end

  def create_tags_by_names(tag_names)
    return if tag_names.blank?
  
    tag_names.each do |name|
      tag = Tag.find_by(name: name)
      board_tags.create(tag: tag) if tag
    end
  end

  def update_tags_by_name(tag_names)
    return if tag_names.blank?

    tag_names.each do |name|
      tag = Tag.find_by(name: name)
      if tag && !board_tags.exists?(tag: tag)
        board_tags.create(tag: tag)
      end
    end

    board_tags.each do |bt|
      bt.destroy if !tag_names.include?(bt.tag.name)
    end
  end
end
