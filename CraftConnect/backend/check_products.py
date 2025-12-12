import sqlite3

conn = sqlite3.connect('craftconnect.db')

# Count total products
cursor = conn.execute('SELECT COUNT(*) FROM products')
count = cursor.fetchone()[0]
print(f'\nTotal products: {count}')

# Count by status
cursor2 = conn.execute('SELECT status, COUNT(*) FROM products GROUP BY status')
print('\nProducts by status:')
for row in cursor2:
    print(f'  {row[0]}: {row[1]}')

# Show recent products
cursor3 = conn.execute('SELECT product_id, title, status FROM products ORDER BY created_at DESC LIMIT 5')
print('\nRecent products:')
for row in cursor3:
    print(f'  ID: {row[0][:8]}... | {row[1][:40]} | Status: {row[2]}')

conn.close()
