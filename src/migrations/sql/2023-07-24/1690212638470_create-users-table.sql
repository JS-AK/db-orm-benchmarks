CREATE TABLE users(
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    id_user_role                    UUID,

    email                           TEXT UNIQUE,
    first_name                      TEXT,
    last_name                       TEXT,
    password                        TEXT,
    salt                            TEXT,

    deleted_at                      TIMESTAMP WITHOUT TIME ZONE,
    is_deleted                      BOOLEAN NOT NULL DEFAULT FALSE,

    created_at                      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at                      TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT users_user_roles_id_user_role_fk
        FOREIGN KEY(id_user_role)
            REFERENCES user_roles(id) ON DELETE CASCADE

);

CREATE INDEX idx__users__email ON users(email);
CREATE INDEX idx__users__is_deleted ON users(is_deleted);
