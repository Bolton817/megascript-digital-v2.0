import { db } from "../server/db";
import { RoleName, UserStatus } from "@prisma/client";
import {
  validateSessionWithInactivity,
  revokeSession,
} from "../features/auth/session";
import {
  getUserRolesAndPermissions,
  hasPermission,
} from "../features/auth/rbac";
import {
  updateUserRole,
  updateUserStatus,
  removeUserFromAllowlist,
  ProtectedAccountError,
} from "../features/auth/user-management";

async function runStage06Tests() {
  console.log("=================================================");
  console.log("Running Stage 06 RBAC & Session Inactivity Tests");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  try {
    // Retrieve initial seeded users
    const superAdmin = await db.user.findUnique({
      where: { normalizedEmail: "megascriptdigital@gmail.com" },
    });
    const secondaryAdmin = await db.user.findUnique({
      where: { normalizedEmail: "boltonmoseti78@gmail.com" },
    });

    assert(!!superAdmin, "Super Admin user exists in database");
    assert(superAdmin?.isProtected === true, "Super Admin has isProtected: true");
    assert(!!secondaryAdmin, "Secondary Admin user exists in database");

    // -------------------------------------------------------------------------
    // TEST SUITE 1: 15-Minute Session Inactivity Expiry (TDD Sheet 100, 171)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 1: Inactivity Policy & Revocation ---");

    const expiredToken = `test-expired-token-${Date.now()}`;
    const sixteenMinutesAgo = new Date(Date.now() - 16 * 60 * 1000);
    const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create session with lastActivityAt 16 minutes in the past
    await db.session.create({
      data: {
        userId: superAdmin!.id,
        token: expiredToken,
        lastActivityAt: sixteenMinutesAgo,
        expiresAt: futureExpiry,
      },
    });

    const expiredCheck = await validateSessionWithInactivity(expiredToken);
    assert(expiredCheck.valid === false, "Inactive session (>15 min) is rejected");
    assert(
      expiredCheck.reason === "INACTIVITY_TIMEOUT",
      "Rejection reason is INACTIVITY_TIMEOUT"
    );

    // Check that session was deleted from database
    const sessionInDb = await db.session.findUnique({
      where: { token: expiredToken },
    });
    assert(sessionInDb === null, "Inactive session was automatically deleted from database");

    // Check that audit log was recorded
    const auditRecord = await db.auditLog.findFirst({
      where: {
        action: "SESSION_EXPIRED_INACTIVITY",
        targetId: { not: null },
      },
      orderBy: { createdAt: "desc" },
    });
    assert(
      auditRecord?.action === "SESSION_EXPIRED_INACTIVITY",
      "SESSION_EXPIRED_INACTIVITY audit log entry was created"
    );

    // Test active session with activity throttling
    const activeToken = `test-active-token-${Date.now()}`;
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const activeSession = await db.session.create({
      data: {
        userId: superAdmin!.id,
        token: activeToken,
        lastActivityAt: twoMinutesAgo,
        expiresAt: futureExpiry,
      },
    });

    const activeCheck = await validateSessionWithInactivity(activeToken, {
      isQualifyingActivity: true,
    });
    assert(activeCheck.valid === true, "Active session (<15 min) passes validation");

    const updatedSession = await db.session.findUnique({
      where: { id: activeSession.id },
    });
    assert(
      updatedSession!.lastActivityAt.getTime() > twoMinutesAgo.getTime(),
      "Qualifying activity updated lastActivityAt timestamp"
    );

    // Cleanup active test session
    await revokeSession(activeToken);

    // -------------------------------------------------------------------------
    // TEST SUITE 2: RBAC Permission Matrix & Boundaries (TDD Sheet 101, 171)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 2: Role Permissions & Access Boundaries ---");

    // Super Admin tests
    const superAdminPerms = await getUserRolesAndPermissions(superAdmin!.id);
    assert(superAdminPerms.isSuperAdmin === true, "Super Admin detected as isSuperAdmin");
    assert(
      await hasPermission(superAdmin!.id, "content.write"),
      "Super Admin has content.write permission"
    );
    assert(
      await hasPermission(superAdmin!.id, "users.manage"),
      "Super Admin has users.manage permission"
    );
    assert(
      await hasPermission(superAdmin!.id, "security.manage"),
      "Super Admin has security.manage permission"
    );

    // Create temporary mock users for Editor and Analyst to test role boundaries
    const editorRole = await db.role.findUnique({ where: { name: RoleName.EDITOR } });
    const analystRole = await db.role.findUnique({ where: { name: RoleName.ANALYST } });

    assert(!!editorRole, "Editor role exists in database");
    assert(!!analystRole, "Analyst role exists in database");

    const testEditor = await db.user.upsert({
      where: { normalizedEmail: "test-editor-stage6@megascript.internal" },
      update: { status: "ACTIVE" },
      create: {
        email: "test-editor-stage6@megascript.internal",
        normalizedEmail: "test-editor-stage6@megascript.internal",
        displayName: "Test Editor",
        status: "ACTIVE",
      },
    });
    await db.userRole.deleteMany({ where: { userId: testEditor.id } });
    await db.userRole.create({
      data: { userId: testEditor.id, roleId: editorRole!.id },
    });

    const testAnalyst = await db.user.upsert({
      where: { normalizedEmail: "test-analyst-stage6@megascript.internal" },
      update: { status: "ACTIVE" },
      create: {
        email: "test-analyst-stage6@megascript.internal",
        normalizedEmail: "test-analyst-stage6@megascript.internal",
        displayName: "Test Analyst",
        status: "ACTIVE",
      },
    });
    await db.userRole.deleteMany({ where: { userId: testAnalyst.id } });
    await db.userRole.create({
      data: { userId: testAnalyst.id, roleId: analystRole!.id },
    });

    // Editor permission boundary checks
    assert(
      await hasPermission(testEditor.id, "content.write") === true,
      "Editor CAN write content (content.write: true)"
    );
    assert(
      await hasPermission(testEditor.id, "content.publish") === true,
      "Editor CAN publish content (content.publish: true)"
    );
    assert(
      await hasPermission(testEditor.id, "users.manage") === false,
      "Editor CANNOT manage users (users.manage: false)"
    );
    assert(
      await hasPermission(testEditor.id, "security.manage") === false,
      "Editor CANNOT manage security settings (security.manage: false)"
    );

    // Analyst permission boundary checks
    assert(
      await hasPermission(testAnalyst.id, "analytics.read") === true,
      "Analyst CAN read analytics (analytics.read: true)"
    );
    assert(
      await hasPermission(testAnalyst.id, "dashboard.read") === true,
      "Analyst CAN read dashboard (dashboard.read: true)"
    );
    assert(
      await hasPermission(testAnalyst.id, "content.write") === false,
      "Analyst CANNOT write content (content.write: false)"
    );
    assert(
      await hasPermission(testAnalyst.id, "settings.manage") === false,
      "Analyst CANNOT manage settings (settings.manage: false)"
    );
    assert(
      await hasPermission(testAnalyst.id, "users.manage") === false,
      "Analyst CANNOT manage users (users.manage: false)"
    );

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Immutable Super Administrator Protection (TDD Sheet 098, 171)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 3: Immutable Super Admin Protection ---");

    // 1. Unauthorized admin (without users.manage) cannot mutate users
    let unauthorizedRejected = false;
    try {
      await updateUserRole(secondaryAdmin!.id, testEditor.id, RoleName.ANALYST);
    } catch (err: any) {
      if (err.name === "UserManagementError") {
        unauthorizedRejected = true;
      }
    }
    assert(unauthorizedRejected, "User without users.manage cannot modify roles (UserManagementError)");

    // 2. Even authorized caller cannot demote, deactivate, or delete protected Super Admin
    let demoteRejected = false;
    try {
      await updateUserRole(superAdmin!.id, superAdmin!.id, RoleName.ANALYST);
    } catch (err: any) {
      if (err instanceof ProtectedAccountError) {
        demoteRejected = true;
      }
    }
    assert(demoteRejected, "Attempt to demote Super Admin role was rejected with ProtectedAccountError");

    let deactivateRejected = false;
    try {
      await updateUserStatus(superAdmin!.id, superAdmin!.id, UserStatus.INACTIVE);
    } catch (err: any) {
      if (err instanceof ProtectedAccountError) {
        deactivateRejected = true;
      }
    }
    assert(deactivateRejected, "Attempt to deactivate Super Admin was rejected with ProtectedAccountError");

    let removeAllowlistRejected = false;
    try {
      await removeUserFromAllowlist(superAdmin!.id, "megascriptdigital@gmail.com");
    } catch (err: any) {
      if (err instanceof ProtectedAccountError) {
        removeAllowlistRejected = true;
      }
    }
    assert(removeAllowlistRejected, "Attempt to remove Super Admin from allowlist was rejected with ProtectedAccountError");

    // Verify security audit alert for attempted mutations
    const securityAlert = await db.auditLog.findFirst({
      where: {
        action: "PROTECTED_ACCOUNT_MUTATION_REJECTED",
      },
      orderBy: { createdAt: "desc" },
    });
    assert(
      securityAlert?.action === "PROTECTED_ACCOUNT_MUTATION_REJECTED",
      "PROTECTED_ACCOUNT_MUTATION_REJECTED security audit alert was recorded"
    );

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Manageable Secondary Account (TDD Sheet 098, 171)
    // -------------------------------------------------------------------------
    console.log("\n--- Suite 4: Manageable Secondary Account ---");

    // Super Admin can change secondary admin's role to EDITOR and back to ADMIN
    const roleChangeResult = await updateUserRole(
      superAdmin!.id,
      secondaryAdmin!.id,
      RoleName.EDITOR
    );
    assert(roleChangeResult.success === true, "Super Admin successfully changed secondary account role to EDITOR");

    // Revert role back to ADMIN
    const revertRoleResult = await updateUserRole(
      superAdmin!.id,
      secondaryAdmin!.id,
      RoleName.ADMIN
    );
    assert(revertRoleResult.success === true, "Secondary account role successfully reverted to ADMIN");

    // Cleanup mock users
    await db.userRole.deleteMany({
      where: { userId: { in: [testEditor.id, testAnalyst.id] } },
    });
    await db.user.deleteMany({
      where: { id: { in: [testEditor.id, testAnalyst.id] } },
    });

    console.log(`\n=================================================`);
    console.log(`All ${totalTests} tests passed successfully (${passedTests}/${totalTests})!`);
    console.log(`STOP/GO Gate 06 Authorization verification: COMPLETE`);
    console.log(`=================================================\n`);
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runStage06Tests();
