Er::Application.routes.draw do

  get 'api/get_records_for_date', defaults: { format: 'xml' }

  controller :records do
    get    'records' => :index
    post   'records' => :show
    put    'records' => :update
    delete 'records' => :destroy
  end

  controller :receptions do
    get  'receptions'           => :index
    get  'receptions-to-doctor' => :create
    post 'receptions-to-doctor' => :create
  end

  get  'ticket', to: 'ticket#show'
  post 'ticket_empty', to: 'ticket#index'

  post 'date', to: 'date#create'

  controller :sessions do
    get    'login'          => :new
    get    'oauth2callback' => :callback
    delete 'logout'         => :destroy
  end

  controller :external_records do
    get    'external_records' => :index
    post   'external_records' => :show
    delete 'external_records' => :destroy
  end

  get  'internal_records', to: 'internal_records#index'
  post 'internal_records', to: 'internal_records#create'

  resources :quotum_doctors

  resources :records

  resources :accounts

  resources :roles

  resources :doctors

  resources :posts

  resources :statuses

  resources :flags

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
