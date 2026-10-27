/**
 * sqlRunner.js
 * Runs candidate SQL queries in-memory using alasql (pure JavaScript SQL engine).
 * No external database needed — perfect for assessment questions.
 *
 * Flow:
 *  1. Execute sqlSchema (CREATE TABLE + INSERT) to build the in-memory DB
 *  2. Execute candidate's query
 *  3. Compare output to expected result
 */
import alasqlModule from 'alasql';
const alasql = alasqlModule?.default || alasqlModule;

/**
 * Run a SQL query against a temporary in-memory database.
 *
 * @param {string} schema   - CREATE TABLE and INSERT statements
 * @param {string} query    - Candidate's SELECT (or other) query
 * @returns {{ rows, error, output }}
 */
export function runSql(schema, query) {
  if (!alasql) {
    return { rows: null, error: 'SQL engine is initializing. Please try again shortly.', output: '' };
  }

  // Create a fresh isolated alasql database for each run
  const dbName = `testdb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  try {
    alasql(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    alasql(`USE \`${dbName}\``);

    // Run schema setup
    if (schema && schema.trim()) {
      // Split on semicolons, run each statement
      const stmts = schema.split(';').map(s => s.trim()).filter(Boolean);
      for (const stmt of stmts) {
        alasql(stmt);
      }
    }

    // Run candidate query
    const trimmedQuery = (query || '').trim();

    // Basic safety: block destructive statements in candidate queries
    const lower = trimmedQuery.toLowerCase();
    const blocked = ['drop ', 'truncate ', 'delete ', 'update ', 'insert ', 'create ', 'alter ', 'grant ', 'revoke '];
    for (const kw of blocked) {
      if (lower.startsWith(kw)) {
        return { rows: null, error: `Statement type "${kw.trim().toUpperCase()}" is not allowed in candidate queries. Only SELECT is permitted.`, output: '' };
      }
    }

    const rows = alasql(trimmedQuery);

    // Normalize output to a stable string for comparison
    const output = normalizeOutput(rows);

    return { rows, error: null, output };
  } catch (err) {
    return { rows: null, error: err.message, output: '' };
  } finally {
    // Clean up database
    try { alasql(`DROP DATABASE IF EXISTS \`${dbName}\``); } catch {}
  }
}

/**
 * Check if candidate's query output matches the expected output.
 * Comparison is order-insensitive (sorts rows before comparing).
 */
export function checkSqlAnswer(schema, candidateQuery, expectedOutput) {
  const { rows, error, output } = runSql(schema, candidateQuery);
  if (error) return { passed: false, error, output: '', rows: null };

  // Compare normalized outputs
  const passed = normalizeOutput(rows) === normalizeExpected(expectedOutput);
  return { passed, error: null, output, rows };
}

function normalizeOutput(rows) {
  if (!rows || !Array.isArray(rows)) return '[]';
  return JSON.stringify(
    rows
      .map(r => Object.fromEntries(
        Object.entries(r).map(([k, v]) => [k.toLowerCase(), String(v ?? '').toLowerCase().trim()])
      ))
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  );
}

function normalizeExpected(expected) {
  if (!expected || !expected.trim()) return '[]';
  try {
    const parsed = JSON.parse(expected);
    return normalizeOutput(Array.isArray(parsed) ? parsed : [parsed]);
  } catch {
    // If not JSON, try to normalize as plain text rows
    return expected.trim().toLowerCase();
  }
}

export default { runSql, checkSqlAnswer };
