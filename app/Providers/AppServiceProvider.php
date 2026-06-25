<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enables Eloquent strict mode, which automatically activates 3 safety features:
        // 1. preventLazyLoading(): Throws exception on N+1 queries (lazy loaded relationships)
        // 2. preventSilentlyDiscardingAttributes(): Throws exception when assigning to non-fillable attributes
        // 3. preventAccessingMissingAttributes(): Throws exception when accessing attributes not retrieved from the database
        Model::shouldBeStrict(! $this->app->environment('production'));
    }
}
