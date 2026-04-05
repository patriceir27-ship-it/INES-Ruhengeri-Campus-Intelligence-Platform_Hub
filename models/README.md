# AI Models Directory

Place your trained model files here before deploying.

## Expected Files

| Filename | Description |
|---|---|
| `enrollment_forecast_model.json` | TensorFlow.js LSTM model for enrollment prediction |
| `dropout_risk_classifier.json` | TF.js model for student dropout risk scoring |
| `course_difficulty_predictor.json` | Gradient Boosting course difficulty model |
| `staffing_optimizer.json` | Staff allocation optimization model |
| `infra_priority_ranker.json` | Infrastructure priority ranking model |
| `campus_traffic_predictor.json` | Campus foot traffic time-series model |
| `staff_burnout_detector.json` | Staff burnout SVM detection model |
| `energy_consumption_predictor.json` | ARIMA energy forecasting model |

## Training Instructions

1. Prepare your dataset from INES student/staff records (CSV format)
2. Train using Python (scikit-learn or TensorFlow)
3. Export to TensorFlow.js format:
   ```python
   import tensorflowjs as tfjs
   tfjs.converters.save_keras_model(model, './models/')
   ```
4. Upload the generated `.json` and `weights.bin` files to this directory
5. Update `js/data.js` to load the model using `tf.loadLayersModel('./models/MODEL_NAME.json')`

## Data Privacy Note

All model files should be trained on anonymized/aggregated data only.
Do not include any personally identifiable information (PII) in model files.
