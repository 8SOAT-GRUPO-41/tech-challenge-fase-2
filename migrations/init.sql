CREATE TYPE order_status AS ENUM (
    'AWAITING_PAYMENT',
    'PAID',
    'RECEIVED',
    'IN_PREPARATION',
    'READY',
    'COMPLETED'
);

CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PAID',
    'CANCELED'
);

CREATE TYPE product_category AS ENUM (
    'Lanche',
    'Acompanhamento',
    'Bebida',
    'Sobremesa'
);

CREATE TABLE "customers" (
    "customer_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "cpf" TEXT UNIQUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id"),
    CONSTRAINT "customers_email_cpf" UNIQUE ("email", "cpf")
);

CREATE TABLE "orders" (
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "total" DECIMAL(10, 2) NOT NULL,
    "status" order_status NOT NULL,
    "payment_status" payment_status NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id"),
    CONSTRAINT "fk_customer"
        FOREIGN KEY ("customer_id")
        REFERENCES "customers" ("customer_id")
        ON DELETE SET NULL
);

CREATE TABLE "products" (
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "description" TEXT NOT NULL,
    "category" product_category NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

CREATE TABLE "order_products" (
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10, 2) NOT NULL,

    CONSTRAINT "pk_order_products" PRIMARY KEY ("order_id", "product_id"),

    CONSTRAINT "fk_order"
        FOREIGN KEY ("order_id")
        REFERENCES "orders" ("order_id")
        ON DELETE CASCADE
);
