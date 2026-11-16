#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8a455dcd26c780ed3e186da608b825cf1420e41d624bb54e0ef43dbf05a22bf6/contract';
import endContract from '../../snapshots/8a455dcd26c780ed3e186da608b825cf1420e41d624bb54e0ef43dbf05a22bf6/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Trip',
        columns: [
          col('attendees', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('date', 'date', { notNull: true, codecRef: { codecId: 'pg/date-string@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('slots', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Trip_attendees_elem_not_null_75685dad',
            sql`array_position("attendees", NULL) IS NULL`,
          ),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
