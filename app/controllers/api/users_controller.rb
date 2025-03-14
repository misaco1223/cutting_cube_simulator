class Api::UsersController < ApplicationController
  def create
    user = User.new(user_params)
    Rails.logger.debug "User Params: #{params.inspect}" 
    if user.save
      # もしguest_idのCutCubeレコードがあるならuser_idを更新するコードをCutCubeテーブル作成後に追加する
      session[:user_id] = user.id
      render json: { user: { name: user.name }, message: "ユーザー登録完了" }, status: :ok
    else
      render json: { message: "すでに登録されたメールアドレスです。" }, status: :unprocessable_entity
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
