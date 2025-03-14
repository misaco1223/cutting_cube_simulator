Rails.application.routes.draw do
  namespace :api do
    resources :cut_cube, only: [:create, :index, :show]
    resource :cookies, only: [:create]
    resources :users, only: [:create]
    resource :sessions, only: [:create, :destroy]
  end

  get '*path', to: 'application#frontend', constraints: ->(req) {!req.xhr? && req.format.html?}
end
