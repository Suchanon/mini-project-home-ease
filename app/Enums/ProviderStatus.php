<?php

namespace App\Enums;

enum ProviderStatus: string
{
    case Available = 'available';
    case Unavailable = 'unavailable';
    case OnLeave = 'on_leave';

    /**
     * Get all status values as an array.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
