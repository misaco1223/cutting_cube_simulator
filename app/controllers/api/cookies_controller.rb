class Api::CookiesController < ApplicationController
  def create
    unless cookies[:guest_id].present?
      cookies[:guest_id] = {
        value: SecureRandom.uuid,
        expires: 1.year.from_now,
        path: '/api',
        same_site: :lax,
        httponly: true, # XSS対策
        secure: Rails.env.production? # HTTPSのみ（本番環境）
      }
      Rails.logger.info("cookies[:guest_id]が保存されました: #{cookies[:guest_id]}")
    end
    render json: { message: "Cookieを生成しました" }, status: :ok
  end
end