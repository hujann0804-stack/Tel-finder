
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpeoeohuxdbfbvlfhvfs.supabase.co';
const supabaseKey = 'sb_publishable_r4SwVuGGDihNsyOEYXnhhw_k3YVaoE9';

export const supabase = createClient(supabaseUrl, supabaseKey);
