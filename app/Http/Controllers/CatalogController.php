<?php

namespace App\Http\Controllers;

use App\Enums\ProviderStatus;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProviderResource;
use App\Http\Resources\ServiceResource;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function getCategories()
    {
        $categories = Category::withCount('services')->get();

        return CategoryResource::collection($categories);
    }

    public function getServices(Request $request)
    {
        $services = Service::with('category')
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', '%'.$search.'%');
            })
            ->get();

        return ServiceResource::collection($services);
    }

    public function getServiceProviders(int $serviceId)
    {
        $service = Service::findOrFail($serviceId);

        $providers = Provider::where('status', ProviderStatus::Available)
            ->whereRelation('categories', 'categories.id', $service->category_id)
            ->get();

        return ProviderResource::collection($providers);
    }
}
