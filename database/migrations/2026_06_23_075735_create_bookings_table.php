<?php

use App\Enums\BookingStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('service_id')->constrained('services')->onDelete('restrict');
            $table->foreignId('provider_id')->constrained('providers')->onDelete('restrict');
            $table->text('description');
            $table->dateTime('appointment_datetime');
            $table->text('address');
            $table->enum('status', BookingStatus::values())->default(BookingStatus::Pending->value);
            $table->decimal('price_charged', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
