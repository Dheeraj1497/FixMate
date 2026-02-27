Rails.application.routes.draw do
  devise_for :users, 
             path: 'api/v1/auth', 
             controllers: {
               sessions: 'api/v1/users/sessions',
               registrations: 'api/v1/users/registrations'
             }, 
             path_names: {
               sign_in: 'login',
               sign_out: 'logout',
               registration: 'register'
             }

  namespace :api do
    namespace :v1 do
      resources :workers, only: [:index, :show] do
        collection do
          get :profile, to: 'workers#profile'
          put :profile, to: 'workers#update_profile'
          patch :availability, to: 'workers#update_availability'
        end
      end

      resources :jobs, only: [:create, :show] do
        collection do
          get :my, to: 'jobs#my_jobs'
        end
        member do
          patch :accept
          patch :reject
          patch :complete
          patch :cancel
        end
      end
      
      resources :cities, only: [:index]
      resources :categories, only: [:index]
      resources :notifications, only: [:index] do
        collection do
          get :unread_count
        end
        member do
          patch :mark_read
        end
      end

      get 'users/me', to: 'users#me'
    end
  end
end
