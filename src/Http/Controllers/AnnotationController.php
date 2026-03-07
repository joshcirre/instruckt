<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Instruckt\Laravel\Store;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

final class AnnotationController
{
    public function index(): JsonResponse
    {
        return response()->json(Store::allAnnotations());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'comment' => 'required|string|max:2000',
            'element' => 'required|string|max:255',
            'element_path' => 'nullable|string|max:2048',
            'css_classes' => 'nullable|string',
            'nearby_text' => 'nullable|string|max:500',
            'selected_text' => 'nullable|string|max:500',
            'bounding_box' => 'nullable|array',
            'screenshot' => 'nullable|string',
            'intent' => 'sometimes|string|in:fix,change,question,approve',
            'severity' => 'sometimes|string|in:blocking,important,suggestion',
            'framework' => 'nullable|array',
            'url' => 'required|string|max:2048',
        ]);

        $annotation = Store::createAnnotation($data);

        return response()->json($annotation, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'status' => 'sometimes|string|in:pending,resolved,dismissed',
            'comment' => 'sometimes|string|max:2000',
        ]);

        if (isset($data['status']) && in_array($data['status'], ['resolved', 'dismissed'], true)) {
            $data['resolved_at'] = now()->toIso8601String();
            $data['resolved_by'] = 'human';
        }

        $annotation = Store::updateAnnotation($id, $data);

        return response()->json($annotation);
    }

    public function screenshot(string $filename): BinaryFileResponse
    {
        $path = storage_path("app/_instruckt/screenshots/{$filename}");

        abort_unless(file_exists($path), 404);

        return response()->file($path, ['Content-Type' => 'image/png']);
    }
}
