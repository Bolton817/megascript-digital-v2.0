# MegaScript Digital: Backup & Disaster Recovery Guide

**Audience:** Database Administrators, DevOps, and Technical Custodians  
**Database:** Supabase PostgreSQL 15 (AWS Ireland `eu-west-1`)  
**Governing Standard:** Antigravity TDD Specification Sheet 119; Appendixes 17–18

---

## 1. Backup Strategy Overview

| Backup Layer | Mechanism | Frequency | Retention | RPO / RTO Target |
| :--- | :--- | :---: | :---: | :---: |
| **Automated Physical Snapshots** | Supabase Managed Daily WAL Archiving | Daily (00:00 UTC) | 7 Days | RPO < 24 Hours, RTO < 30 Mins |
| **Point-In-Time Recovery (PITR)** | Continuous Write-Ahead Log streaming | Continuous | Up to 7 Days | RPO < 5 Minutes, RTO < 1 Hour |
| **Manual Logical Backups** | CLI `pg_dump` compressed custom archive | Weekly / Pre-Deploy | 90 Days offline | RPO Manual, RTO < 20 Mins |

---

## 2. Manual Logical Backup Runbook (pg_dump)

Before executing significant schema updates or quarterly reviews, take a manual logical dump:

```bash
# 1. Set environment variables from .env
export DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
export BACKUP_DATE=$(date +%Y%m%d_%H%M%S)

# 2. Execute pg_dump with custom compressed format
pg_dump -d "$DIRECT_URL" -F c -b -v -f "megascript_backup_${BACKUP_DATE}.dump"

# 3. Verify backup archive integrity
pg_restore --list "megascript_backup_${BACKUP_DATE}.dump" > /dev/null
echo "Backup megascript_backup_${BACKUP_DATE}.dump verified successfully."
```

---

## 3. Disaster Recovery & Restoration Procedures

### Scenario A: Minor Data Corruption or Accidental Record Deletion
1. Extract specific table data from the latest logical dump using `pg_restore`:
   ```bash
   pg_restore -d "$DIRECT_URL" -t "Lead" "megascript_backup.dump"
   ```
2. Verify table integrity in Supabase Studio.

### Scenario B: Catastrophic Database Failure or Total Reset
1. Provision a clean PostgreSQL database in Supabase.
2. Restore full database schema and records:
   ```bash
   pg_restore --clean --if-exists -d "$NEW_DIRECT_URL" -v "megascript_backup.dump"
   ```
3. Run Prisma validation:
   ```bash
   npx prisma migrate deploy
   npx tsx scripts/production-migrate-seed.ts
   ```
4. Update Netlify environment variables (`DATABASE_URL` and `DIRECT_URL`) to point to the restored database instance.
5. Re-run production smoke tests (`npx tsx scripts/test-production-smoke.ts`).
