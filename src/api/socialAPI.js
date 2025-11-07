import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { extractHashtags, extractMentions, mapVisibilityToAPI, mapCommentVisibilityToAPI } from '../utils/helpers';

/**
 * Create a new post with media files
 * @param {Object} postData - Post data object
 * @param {string} postData.content - Post text content (required if no media)
 * @param {string} postData.caption - Post caption (optional)
 * @param {string} postData.visibility - Post visibility: 'public' | 'followers' | 'private' (default: 'public')
 * @param {string} postData.commentVisibility - Comment visibility: 'everyone' | 'followers' | 'none' (default: 'everyone')
 * @param {Object} postData.location - Location object with name, coordinates, address, etc. (optional)
 * @param {Array} postData.mediaItems - Array of media items with uri, type, isVideo properties
 * @param {Array} postData.hashtags - Array of hashtag strings (optional, will be extracted from content if not provided)
 * @param {Array} postData.mentions - Array of mention strings (optional, will be extracted from content if not provided)
 * @returns {Promise<Object>} Response object with success status and data
 */
export const createPost = async (postData) => {
  console.log('📝 SocialAPI: createPost called');
  console.log('📝 Post Data:', {
    ...postData,
    mediaItems: postData.mediaItems?.map(item => ({ uri: item.uri?.substring(0, 50) + '...', type: item.type, isVideo: item.isVideo })),
  });

  try {
    // Validate required fields
    if (!postData.content && (!postData.mediaItems || postData.mediaItems.length === 0)) {
      return {
        success: false,
        error: 'Either content or media files are required',
        message: 'Please provide content or at least one media file',
      };
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add content if provided
    if (postData.content) {
      formData.append('content', postData.content);
    }

    // Add caption if provided
    if (postData.caption) {
      formData.append('caption', postData.caption);
    }

    // Add visibility (map from UI format to API format)
    const visibility = postData.visibility 
      ? mapVisibilityToAPI(postData.visibility)
      : 'public';
    formData.append('visibility', visibility);

    // Add comment visibility (map from UI format to API format)
    const commentVisibility = postData.commentVisibility
      ? mapCommentVisibilityToAPI(postData.commentVisibility)
      : 'everyone';
    formData.append('commentVisibility', commentVisibility);

    // Add location if provided (stringified JSON)
    if (postData.location) {
      const locationString = typeof postData.location === 'string' 
        ? postData.location 
        : JSON.stringify(postData.location);
      formData.append('location', locationString);
    }

    // Extract and add hashtags
    let hashtags = postData.hashtags || [];
    if (postData.content) {
      const extractedHashtags = extractHashtags(postData.content);
      // Merge with provided hashtags and remove duplicates
      hashtags = [...new Set([...hashtags, ...extractedHashtags])];
    }
    if (postData.caption) {
      const extractedFromCaption = extractHashtags(postData.caption);
      hashtags = [...new Set([...hashtags, ...extractedFromCaption])];
    }
    if (hashtags.length > 0) {
      formData.append('hashtags', JSON.stringify(hashtags));
    }

    // Extract and add mentions
    let mentions = postData.mentions || [];
    if (postData.content) {
      const extractedMentions = extractMentions(postData.content);
      mentions = [...new Set([...mentions, ...extractedMentions])];
    }
    if (postData.caption) {
      const extractedFromCaption = extractMentions(postData.caption);
      mentions = [...new Set([...mentions, ...extractedFromCaption])];
    }
    if (mentions.length > 0) {
      formData.append('mentions', JSON.stringify(mentions));
    }

    // Add media files
    if (postData.mediaItems && postData.mediaItems.length > 0) {
      let validFilesCount = 0;
      postData.mediaItems.forEach((item, index) => {
        if (item.uri && item.uri.trim()) {
          // Use URI as-is (React Native FormData needs file:// prefix for local files)
          let fileUri = item.uri;
          
          // Determine file type
          const isVideo = item.isVideo || item.type === 'video';
          
          // Try to detect file extension from URI
          let fileExtension = 'jpg';
          const uriMatch = fileUri.match(/\.([a-zA-Z0-9]+)(\?|$)/);
          if (uriMatch) {
            fileExtension = uriMatch[1].toLowerCase();
          } else {
            fileExtension = isVideo ? 'mp4' : 'jpg';
          }
          
          // Set appropriate MIME type based on extension
          let mimeType = 'image/jpeg';
          if (isVideo) {
            mimeType = 'video/mp4';
          } else {
            switch (fileExtension.toLowerCase()) {
              case 'png':
                mimeType = 'image/png';
                break;
              case 'jpg':
              case 'jpeg':
                mimeType = 'image/jpeg';
                break;
              case 'gif':
                mimeType = 'image/gif';
                break;
              case 'webp':
                mimeType = 'image/webp';
                break;
              default:
                mimeType = 'image/jpeg';
            }
          }
          
          // Get filename from URI or generate one
          let fileName = item.fileName;
          if (!fileName) {
            const uriParts = fileUri.split('/');
            const lastPart = uriParts[uriParts.length - 1];
            // Remove query parameters if any
            const cleanLastPart = lastPart.split('?')[0];
            fileName = cleanLastPart || `media_${index}.${fileExtension}`;
          }

          // Ensure filename has proper extension
          if (!fileName.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i)) {
            fileName = `${fileName}.${fileExtension}`;
          }

          console.log(`📎 Adding file ${index + 1}/${postData.mediaItems.length}:`, {
            uri: fileUri.substring(0, 50) + '...',
            type: mimeType,
            name: fileName,
            isVideo,
          });

          // Append file to FormData
          // Note: For React Native, FormData file format is: { uri, type, name }
          formData.append('files', {
            uri: fileUri,
            type: mimeType,
            name: fileName,
          });
          validFilesCount++;
        } else {
          console.warn(`⚠️ Skipping media item ${index + 1}: No URI provided`);
        }
      });
      
      if (validFilesCount === 0) {
        return {
          success: false,
          error: 'No valid media files found',
          message: 'Please select at least one valid image or video to upload',
        };
      }
      
      console.log(`✅ Added ${validFilesCount} valid file(s) to FormData`);
    }

    console.log('📤 FormData created with fields:', {
      hasContent: !!postData.content,
      hasCaption: !!postData.caption,
      visibility,
      commentVisibility,
      hasLocation: !!postData.location,
      hashtagsCount: hashtags.length,
      mentionsCount: mentions.length,
      filesCount: postData.mediaItems?.length || 0,
    });

    // Make API call using apiClient (handles auth automatically)
    const responseData = await apiClient.post(API_ENDPOINTS.CREATE_USER_POST, formData);

    console.log('✅ SocialAPI: createPost success');
    console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

    // Extract post ID from response
    const postId = responseData?.data?._id || responseData?._id || null;

    return {
      success: true,
      data: responseData,
      postId,
      message: 'Post created successfully',
    };
  } catch (error) {
    console.log('❌ SocialAPI: createPost error');
    console.log('💥 Error Message:', error.message);
    console.log('💥 Error Stack:', error.stack);
    
    // Log more detailed error information
    if (error.status) {
      console.log('💥 Error Status:', error.status);
    }
    if (error.data) {
      console.log('💥 Error Data:', JSON.stringify(error.data, null, 2));
    }
    
    // Extract more detailed error message
    let errorMessage = error.message || 'Failed to create post';
    if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.data?.error) {
      errorMessage = error.data.error;
    }

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
      details: error.data || null,
      status: error.status || null,
    };
  }
};

/**
 * Get all posts created by the currently authenticated user
 * @param {string} accessToken - User access token (optional, apiClient handles auth automatically)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Number of posts per page (default: 20)
 * @returns {Promise<Object>} Response object with success status, posts array, and pagination metadata
 */
export const getUserPosts = async (accessToken = null, options = {}) => {
  console.log('📝 SocialAPI: getUserPosts called');
  console.log('📝 Options:', options);

  try {
    const { page = 1, limit = 20 } = options;

    // Build query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const endpoint = `${API_ENDPOINTS.GET_USER_POSTS}?${queryParams.toString()}`;
    console.log('📤 Fetching user posts from:', endpoint);

    // Make API call using apiClient (handles auth automatically)
    const responseData = await apiClient.get(endpoint);

    console.log('✅ SocialAPI: getUserPosts success');
    console.log('📊 Response Data:', JSON.stringify(responseData, null, 2));

    // Extract posts and pagination data from response
    // Response structure: { success, data: { posts, pagination: { currentPage, totalPages, totalPosts, hasNext, hasPrev } } }
    const posts = responseData?.data?.posts || 
                  responseData?.data?.data || 
                  responseData?.posts || 
                  responseData?.data || 
                  [];
    
    const paginationData = responseData?.data?.pagination || {};
    const totalCount = paginationData.totalPosts || 
                       responseData?.data?.total || 
                       responseData?.data?.totalCount || 
                       responseData?.total || 
                       posts.length;
    
    const pagination = {
      page: paginationData.currentPage || responseData?.data?.page || page,
      limit: responseData?.data?.limit || limit,
      totalPages: paginationData.totalPages || 
                  responseData?.data?.totalPages || 
                  responseData?.data?.pages || 
                  Math.ceil(totalCount / limit),
      hasMore: paginationData.hasNext !== undefined 
               ? paginationData.hasNext 
               : (responseData?.data?.hasMore !== undefined 
                  ? responseData.data.hasMore 
                  : (paginationData.currentPage || responseData?.data?.page || page) < Math.ceil(totalCount / limit)),
    };

    return {
      success: true,
      data: {
        posts,
        totalCount,
        pagination,
      },
      message: 'Posts fetched successfully',
    };
  } catch (error) {
    console.log('❌ SocialAPI: getUserPosts error');
    console.log('💥 Error Message:', error.message);
    console.log('💥 Error Stack:', error.stack);

    return {
      success: false,
      error: error.message,
      message: 'Failed to fetch user posts',
      data: {
        posts: [],
        totalCount: 0,
        pagination: {
          page: 1,
          limit: options.limit || 20,
          totalPages: 0,
          hasMore: false,
        },
      },
    };
  }
};

// Export social API object
export const socialAPI = {
  createPost,
  getUserPosts,
};

export default socialAPI;

