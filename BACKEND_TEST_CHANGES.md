# 🔧 Backend Changes for Testing (4 Photons)

## ⚠️ BACKEND FILES TO MODIFY

### **File 1: `bb84/serializers.py` (Most Likely)**

```python
# 🔍 FIND THIS:
class BB84GameSerializer(serializers.ModelSerializer):
    photon_number = serializers.IntegerField(min_value=10, max_value=30)
    
    def validate(self, data):
        if data['eve'] and data['photon_number'] < 16:
            raise ValidationError("Minimum 16 photons with Eve")
        if not data['eve'] and data['photon_number'] < 10:
            raise ValidationError("Minimum 10 photons")
        return data
```

```python
# ✅ CHANGE TO:
class BB84GameSerializer(serializers.ModelSerializer):
    photon_number = serializers.IntegerField(min_value=4, max_value=30)  # 🧪 TEST
    
    def validate(self, data):
        if data['eve'] and data['photon_number'] < 4:  # 🧪 TEST
            raise ValidationError("Minimum 4 photons with Eve")
        if not data['eve'] and data['photon_number'] < 4:  # 🧪 TEST
            raise ValidationError("Minimum 4 photons")
        return data
```

---

### **File 2: `bb84/models.py` (If validation in model)**

```python
# 🔍 FIND THIS:
class BB84Game(models.Model):
    photon_number = models.IntegerField(
        validators=[MinValueValidator(10), MaxValueValidator(30)]  # ← HERE
    )
```

```python
# ✅ CHANGE TO:
class BB84Game(models.Model):
    photon_number = models.IntegerField(
        validators=[MinValueValidator(4), MaxValueValidator(30)]  # 🧪 TEST
    )
```

---

### **File 3: `bb84/views.py` (If validation in view)**

```python
# 🔍 FIND THIS:
def create_game(request):
    photon_number = request.data.get('photon_number')
    eve = request.data.get('eve')
    
    if eve and photon_number < 16:  # ← HERE
        return Response({"error": "Min 16 with Eve"}, status=400)
    if not eve and photon_number < 10:  # ← HERE
        return Response({"error": "Min 10 without Eve"}, status=400)
```

```python
# ✅ CHANGE TO:
def create_game(request):
    photon_number = request.data.get('photon_number')
    eve = request.data.get('eve')
    
    if eve and photon_number < 4:  # 🧪 TEST
        return Response({"error": "Min 4 with Eve"}, status=400)
    if not eve and photon_number < 4:  # 🧪 TEST
        return Response({"error": "Min 4 without Eve"}, status=400)
```

---

## 🔍 How to Find Backend Files

### **Command Line Search:**
```bash
cd /path/to/quantumcrypto-backend

# Search for validation rules
grep -rn "min_value=10" bb84/
grep -rn "photon_number.*10" bb84/
grep -rn "photon_number.*16" bb84/
grep -rn "MinValueValidator(10)" bb84/

# List all relevant files
find bb84/ -name "*.py" | grep -E "(serializer|view|model)"
```

### **Expected Files:**
```
bb84/
├── serializers.py   ← Most likely location
├── views.py         ← Possible location
├── models.py        ← Possible location
└── validators.py    ← If custom validators exist
```

---

## 🚀 After Modifying Backend

### **1. Restart Backend Server:**
```bash
# If using Django dev server:
python manage.py runserver

# If using Docker:
docker-compose restart backend

# If using gunicorn/uvicorn:
sudo systemctl restart backend  # or your service name
```

### **2. Test API Directly:**
```bash
# Test with curl
curl -X POST http://localhost:8000/games/bb84/ \
  -H "Content-Type: application/json" \
  -d '{
    "photon_number": 4,
    "eve": false,
    "validation_bits_length": 0,
    "eve_percentage": 0.5
  }'
```

**Expected Response (if working):**
```json
{
  "code": "ABC123",
  "message": "Game created successfully"
}
```

**Error Response (if still failing):**
```json
{
  "photon_number": ["Ensure this value is greater than or equal to 10."]
}
```

---

## 📊 Summary of All Changes Needed

| Component | File | Line | Change |
|-----------|------|------|--------|
| **Frontend** | `create-game-modal.tsx` | ~77-79 | ✅ DONE (10→4, 16→4) |
| **Frontend** | `solo-game-modal.tsx` | ~89-91 | ✅ DONE (10→4, 16→4) |
| **Backend** | `serializers.py` | ? | ⚠️ TODO (10→4, 16→4) |
| **Backend** | `views.py` | ? | ⚠️ TODO (if exists) |
| **Backend** | `models.py` | ? | ⚠️ TODO (if exists) |

---

## ⚠️ IMPORTANT: Restore After Testing

### **Frontend:**
```bash
git checkout components/bb84/home-page/create-game-modal.tsx
git checkout components/bb84/home-page/solo-game-modal.tsx
```

### **Backend:**
```bash
cd ../quantumcrypto-backend
git checkout bb84/serializers.py
git checkout bb84/views.py
git checkout bb84/models.py

# Then restart
python manage.py runserver
```

---

## 🎯 Quick Checklist

- [ ] Frontend modified (create-game-modal.tsx) ✅
- [ ] Frontend modified (solo-game-modal.tsx) ✅
- [ ] Backend modified (serializers.py) ⚠️
- [ ] Backend modified (views.py if needed) ⚠️
- [ ] Backend modified (models.py if needed) ⚠️
- [ ] Backend server restarted ⚠️
- [ ] Test game creation with 4 photons ⚠️
- [ ] Document for easy restoration 📝

---

**Created:** November 13, 2025  
**Purpose:** Enable 4-photon testing by modifying backend validation  
**Status:** 🔧 BACKEND CHANGES NEEDED
