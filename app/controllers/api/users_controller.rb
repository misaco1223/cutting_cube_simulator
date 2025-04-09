class Api::UsersController < ApplicationController
  def create
    user = User.new(user_params)
    Rails.logger.debug "User Params: #{params.inspect}" 
    if user.save
      # もしguest_idのCutCubeレコードがあるならuser_idを更新するコードをCutCubeテーブル作成後に追加する
      if cookies[:guest_id].present?
        CutCube.where(cookie_id: cookies[:guest_id], user_id: nil).update_all(user_id: user.id)
      end
      session[:user_id] = user.id
      render json: { user: { name: user.name }, message: "ユーザー登録完了" }, status: :ok
    else
      render json: { message: "すでに登録されたメールアドレスです。" }, status: :unprocessable_entity
    end
  end

  def me
    if current_user
      masked_email = mask_email(current_user.email)
      render json: { user:{name: current_user.name, email: masked_email}}, status: :ok
    end
  end

  def me_update
    return unless current_user
  
    if user_update_params[:ex_password].present? &&
      user_update_params[:password].present? &&
      user_update_params[:password_confirmation].present?
      if user_update_params[:password] == user_update_params[:password_confirmation] &&
        current_user.authenticate(user_update_params[:ex_password])
        current_user.update(password: user_update_params[:password])
        render json: { message: "password_changed"}, status: :ok
      end
    elsif user_update_params[:name] != current_user.name
      current_user.update(name: user_update_params[:name])
      render json: { user: { name: current_user.name } }, status: :ok
    elsif user_update_params[:email] != current_user.email
      current_user.update(email: user_update_params[:email])
      masked_email = mask_email(current_user.email)
      render json: { user: { email: masked_email } }, status: :ok
    end
  end

  def me_destroy
    if current_user
      if current_user.authenticate(params[:password])
        current_user.destroy
        session[:user_id] = nil
        render json: {message: "ユーザーを削除しました"}, status: :ok
      else
        render json: {error: "パスワードが異なります"}, status: :unauthorized
      end
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def user_update_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :ex_password)
  end

  def mask_email(email)
    local, domain = email.split('@')
    masked_local = local[0..2] + '****'
    return "#{masked_local}@#{domain}"
  end
end
