class Api::SessionsController < ApplicationController
  def create
    user = User.find_by(email: login_params[:email])
    if user.nil?
      render json: { message: "メールアドレスが間違っています"}, status: :unprocessable_entity
    elsif user.authenticate(login_params[:password])
      session[:user_id] = user.id
      # もしguest_idのCutCubeレコードがあるならuser_idを更新
      render json: { user: { name: user.name }, message: "ログイン成功" }, status: :ok
    else
      render json: { message:"パスワードが間違っています" }, status: :unprocessable_entity
    end
  end

  def destroy
    reset_session
    render json: { message: "ログアウトしました" }, status: :ok
  end
  
  private
  
  def login_params
    params.require(:session).permit(:email, :password)
  end
end
