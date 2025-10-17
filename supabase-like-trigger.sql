/*
  # Like System Trigger - Enhanced Version

  This migration ensures the like_count is automatically updated whenever
  a like is added or removed from the likes table.

  Features:
  - Automatic increment on INSERT
  - Automatic decrement on DELETE
  - Prevents negative like counts
  - Updates the updated_at timestamp
  - Security definer for reliable execution
*/

-- Function to update like_count automatically
CREATE OR REPLACE FUNCTION public.update_image_like_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.images
    SET like_count = like_count + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.image_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.images
    SET like_count = GREATEST(like_count - 1, 0),
        updated_at = timezone('utc'::text, now())
    WHERE id = OLD.image_id;
    RETURN OLD;
  END IF;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_like_change ON public.likes;

-- Create trigger
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_image_like_count();

-- Verify trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public' AND event_object_table = 'likes';
