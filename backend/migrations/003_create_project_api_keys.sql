
CREATE TABLE IF NOT EXISTS project_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    key_hash TEXT NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL DEFAULT 'Default key',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_project_api_keys_project_id
    ON project_api_keys(project_id);
