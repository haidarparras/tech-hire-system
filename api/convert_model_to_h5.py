"""
Script untuk convert model .keras ke .h5 (legacy format)
yang lebih kompatibel dengan berbagai versi TensorFlow/Keras.

Usage:
    python convert_model_to_h5.py
"""

import tensorflow as tf
from pathlib import Path

# Paths
ML_DIR = Path(__file__).parent / "ml_models"
KERAS_MODEL = ML_DIR / "tech_hire_model_final.keras"
H5_MODEL = ML_DIR / "tech_hire_model_final.h5"

print(f"[INFO] Loading model from: {KERAS_MODEL}")

try:
    # Load dengan compile=False dan safe_mode=False
    model = tf.keras.models.load_model(
        str(KERAS_MODEL),
        compile=False,
        safe_mode=False
    )
    print("[SUCCESS] Model loaded successfully")
    
    # Recompile dengan config sederhana
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    print("[INFO] Model recompiled")
    
    # Save dalam format .h5 (legacy)
    model.save(str(H5_MODEL), save_format='h5')
    print(f"[SUCCESS] Model saved to: {H5_MODEL}")
    print(f"[INFO] File size: {H5_MODEL.stat().st_size / (1024*1024):.2f} MB")
    
    # Test load .h5
    test_model = tf.keras.models.load_model(str(H5_MODEL))
    print("[SUCCESS] .h5 model can be loaded successfully")
    print("\n✅ Conversion complete! You can now use .h5 model in production.")
    
except Exception as e:
    print(f"[ERROR] Conversion failed: {e}")
    import traceback
    traceback.print_exc()
