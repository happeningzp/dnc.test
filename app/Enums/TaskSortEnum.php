<?php

namespace App\Enums;

enum TaskSortEnum: string
{
    case CreatedAt = 'created_at';
    case CompletedAt = 'completed_at';
    case Priority = 'priority';
}
