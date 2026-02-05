# LAMS-FM API Documentation

Generated automatically from the codebase. Use this as reference for Mobile App development.

---

## Base URL

```
https://your-domain.com/api
```

---

## Authentication

All protected endpoints require Clerk authentication. Include the JWT token in the request header:

```bash
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Health Assessment

#### POST /api/chat
**Description**: AI chat endpoint with health context

**Request Body**:
```json
{
  "message": "string",
  "profileId": "number (optional, defaults to 1)"
}
```

**Response**:
```json
{
  "response": "string",
  "context": {
    "matrixScores": {
      "assimilation": 75,
      "defense": 75,
      "energy": 70,
      "biotransformation": 73,
      "transport": 78,
      "communication": 76,
      "structural": 80,
      "overallScore": 75
    },
    "recentSymptoms": ["array"],
    "activeInterventions": ["array"]
  }
}
```

#### POST /api/questionnaire/submit
**Description**: Submit health assessment questionnaire

**Request Body**:
```json
{
  "questionnaireType": "initial_intake | gut_health | energy_fatigue | hormone_balance | detox_capacity | immune_function | follow_up",
  "responses": {
    "has_fatigue": true,
    "fatigue_severity": 8,
    "has_bloating": true,
    "bloating_severity": 6
  }
}
```

**Response**:
```json
{
  "success": true,
  "scores": {
    "assimilation": 75,
    "defense": 75,
    "energy": 70,
    "biotransformation": 73,
    "transport": 78,
    "communication": 76,
    "structural": 80,
    "OverallScore": 75
  },
  "message": "问卷提交成功！矩阵评分已更新。"
}
```

---

### IoB - Wearable Device Gateway

#### POST /api/iob/ingest
**Description**: Ingest wearable device data from Apple Health, Oura, CGM, Fitbit

**Request Body**:
```json
{
  "provider": "apple_health | oura_ring | cgm | fitbit",
  "dataType": "sleep_score | glucose | hrv | steps | heart_rate | blood_pressure",
  "value": 75,
  "timestamp": "2026-02-05T08:00:00Z (optional)",
  "signature": "string (optional, for future verification)",
  "profileId": 1
}
```

**Response**:
```json
{
  "success": true,
  "message": "Data ingested successfully",
  "trackingId": 123,
  "dataIngested": {
    "provider": "apple_health",
    "dataType": "glucose",
    "value": 85,
    "timestamp": "2026-02-05T08:00:00.000Z"
  },
  "matrixRecalculated": true,
  "aiRecommendation": "检测到血糖水平正常，继续保持健康饮食..."
}
```

**Data Types**:
- `sleep_score` (1-100): 睡眠质量分数
- `glucose` (mg/dL): 血糖水平
- `hrv` (bpm): 静率变异性
- `steps` (number): 步数
- `heart_rate` (bpm): 静率
- `blood_pressure`: 血压

---

### Web3 Wallet Integration

#### POST /api/wallet/connect
**Description**: Connect MetaMask or Phantom wallet

**Request Body**:
```json
{
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "signature": "string (SIWE signature)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Wallet connected successfully",
  "address": "0x1234...5678"
}
```

#### POST /api/wallet/disconnect
**Description**: Disconnect wallet

**Response**:
```json
{
  "success": true,
  "message": "Wallet disconnected successfully"
}
```

---

### Health Genesis Report

#### GET /api/genesis/generate?profileId=1
**Description**: Generate immutable health genesis report with on-chain hash

**Response**:
```json
{
  "success": true,
  "message": "Health Genesis Report generated",
  "data": {
    "metadata": {
      "generatedAt": "2026-02-05T08:00:00.000Z",
      "version": "1.0",
      "network": "ethereum"
    },
    "userProfile": {
      "email": "user@example.com",
      "name": "张三",
      "birthDate": "1985-06-15",
      "gender": "male"
    },
    "matrixScores": {
      "assimilation": 75,
      "defense": 75,
      "energy": 70,
      "biotransformation": 73,
      "transport": 78,
      "communication": 76,
      "structural": 80,
      "overallScore": 75
    },
    "dailyTracking": {
      "date": "2026-02-05",
      "energyLevel": 7,
      "mood": 8,
      "sleepQuality": 7,
      "stressLevel": 3
    },
    "activeInterventions": [...]
  },
  "onChainHash": "0x1234567890abcdef..."
}
```

---

## Automated Tasks

#### POST /api/cron/daily-reset
**Description**: Daily cron job - generates new daily tasks for all users

**Headers**:
```
Authorization: Bearer <cron-secret>
```

**Response**:
```json
{
  "success": true,
  "message": "Daily tasks generated for 10 users",
  "tasksGenerated": 25,
  "timestamp": "2026-02-05T00:00:00.000Z"
}
```

---

## Cron Jobs

### Daily Task Generation
**Endpoint**: `POST /api/cron/daily-reset`
**Schedule**: Daily at 00:00 UTC
**Function**: 
- Iterates all active users
- Generates daily tasks based on active interventions
- Creates new daily_tracking entries

---

## Data Schemas

### MatrixScore
```typescript
{
  assimilation: number,      // 0-100
  defense: number,          // 0-100
  energy: number,           // 0-100
  biotransformation: number,  // 0-100
  transport: number,         // 0-100
  communication: number,     // 0-100
  structural: number,        // 0-100
  overallScore: number        // 0-100
}
```

### IoBData
```typescript
{
  provider: "apple_health | oura_ring | cgm | fitbit",
  dataType: "sleep_score | glucose | hrv | steps | heart_rate | blood_pressure",
  value: number,
  timestamp: string,
  signature: string
}
```

### WalletConnection
```typescript
{
  address: string,  // 0x...
  signature: string // SIWE signature
}
```

---

## Error Codes

| Code | Description |
|------|------------|
| 400 | Bad Request / Validation Failed |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

- `/api/chat`: 10 requests/minute
- `/api/questionnaire/submit`: 5 requests/minute
- `/api/iob/ingest`: 100 requests/minute
- `/api/wallet/*`: 10 requests/minute

---

## Webhook Integration (Future)

### Apple HealthKit
Incoming webhook URL for data sync

### Fitbit Webhook
Incoming webhook URL for device data sync

---

## Mobile App Integration Guide

1. **Authentication**: Use Clerk SDK for user authentication
2. **Health Data**: Use `/api/iob/ingest` endpoint to submit wearable data
3. **Chat**: Use `/api/chat` endpoint for AI recommendations
4. **Wallet**: Use `/api/wallet/connect` for blockchain binding
5. **Genesis Reports**: Use `/api/genesis/generate` for on-chain hash

---

## Example: Complete User Flow

1. User authenticates via Clerk
2. User fills out health questionnaire → `POST /api/questionnaire/submit`
3. Matrix scores calculated automatically
4. User connects wallet → `POST /api/wallet/connect`
5. Wearable data synced → `POST /api/iob/ingest`
6. AI recommendations generated automatically
7. Genesis report generated → `GET /api/genesis/generate`
8. EBIO health assets accumulated
9. NFT/SBT minting ready

---

*Last updated: 2026-02-05*
*Version: 1.0*
