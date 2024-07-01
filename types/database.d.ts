type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

interface SupabaseDataBase {
  public: {
    Tables: {
      boardCommunity: {
        Row: {
          content: string | null
          createdAt: string | null | ComputedRef<string>
          id: string
          isPublished: boolean | null
          latitude: number | null
          locationAddress: string | null
          longitude: number | null
          title: string | null
          useLocation: boolean | null
          userId: string | null
          userInfo?: SupabaseDataBase.public.Tables.userInfo.Row
          likeCount: SupabaseDataBase.public.Tables.noticeLikeCount.Row.likeCount
        }
        Insert: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Update: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'boardCommunity_userId_fkey'
            columns: ['userId']
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      boardNotice: {
        Row: {
          content: string | null
          createdAt: string | null | ComputedRef<string>
          id: string
          isPublished: boolean | null
          latitude: number | null
          locationAddress: string | null
          longitude: number | null
          title: string | null
          useLocation: boolean | null
          userId: string | null
          userInfo?: SupabaseDataBase.public.Tables.userInfo.Row
          likeCount: SupabaseDataBase.public.Tables.noticeLikeCount.Row.likeCount
        }
        Insert: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Update: {
          content?: string | null
          createdAt?: string | null
          id?: string
          isPublished?: boolean | null
          latitude?: number | null
          locationAddress?: string | null
          longitude?: number | null
          title?: string | null
          useLocation?: boolean | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'boardNotice_userId_fkey'
            columns: ['userId']
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      code: {
        Row: {
          code: string | null
          codeCategory: string | null
          codeName: string | null
          createdAt: string | null
          id: string
        }
        Insert: {
          code?: string | null
          codeCategory?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Update: {
          code?: string | null
          codeCategory?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Relationships: []
      }
      communityCommentList: {
        Row: {
          boardId: string | null
          comment: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
          userId: string | null
          userInfo: SupabaseDataBase.public.Tables.userInfo.Row
        }
        Insert: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Update: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'communityCommentList_boardId_fkey'
            columns: ['boardId']
            referencedRelation: 'boardCommunity'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'communityCommentList_userId_fkey'
            columns: ['userId']
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      communityLikeCount: {
        Row: {
          boardId: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
        }
        Insert: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
        }
        Update: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'communityLikeCount_boardId_fkey'
            columns: ['boardId']
            referencedRelation: 'boardCommunity'
            referencedColumns: ['id']
          },
        ]
      }
      fuelData: {
        Row: {
          code: string | null
          codeName: string | null
          createdAt: string | null
          id: string
          opiCode: string | null
        }
        Insert: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
          opiCode?: string | null
        }
        Update: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
          opiCode?: string | null
        }
        Relationships: []
      }
      fuelStation: {
        Row: {
          code: string | null
          createdAt: string | null
          id: string
          logoImage: string | null
          name: string | null
        }
        Insert: {
          code?: string | null
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
        }
        Update: {
          code?: string | null
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
        }
        Relationships: []
      }
      manageType: {
        Row: {
          code: string | null
          codeName: string | null
          createdAt: string | null
          id: string
        }
        Insert: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Update: {
          code?: string | null
          codeName?: string | null
          createdAt?: string | null
          id?: string
        }
        Relationships: []
      }
      manufacturer: {
        Row: {
          createdAt: string | null
          id: string
          logoImage: string | null
          name: string | null
          orderBy: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
          orderBy?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string
          logoImage?: string | null
          name?: string | null
          orderBy?: string | null
        }
        Relationships: []
      }
      noticeCommentList: {
        Row: {
          boardId: string | null
          comment: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
          userId: string | null
          userInfo: SupabaseDataBase.public.Tables.userInfo.Row
        }
        Insert: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Update: {
          boardId?: string | null
          comment?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'noticeCommentList_boardId_fkey'
            columns: ['boardId']
            referencedRelation: 'boardNotice'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'noticeCommentList_userId_fkey'
            columns: ['userId']
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
        ]
      }
      noticeLikeCount: {
        Row: {
          boardId: string | null
          createdAt: string | null
          id: string
          likeCount: number | null
        }
        Insert: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
        }
        Update: {
          boardId?: string | null
          createdAt?: string | null
          id?: string
          likeCount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'noticeLikeCount_boardId_fkey'
            columns: ['boardId']
            referencedRelation: 'boardNotice'
            referencedColumns: ['id']
          },
        ]
      }
      userInfo: {
        Row: {
          address: string | null
          addressDetail: string | null
          avatarImage: string | null
          avatarImageName: string | null
          createdAt: string | null
          email: string | null
          id: string
          isAdmin: boolean | null
          mainVehicleId: string | null
          mobile: string | null
          nickName: string | null
          signInAt: string | null
        }
        Insert: {
          address?: string | null
          addressDetail?: string | null
          avatarImage?: string | null
          avatarImageName?: string | null
          createdAt?: string | null
          email?: string | null
          id: string
          isAdmin?: boolean | null
          mainVehicleId?: string | null
          mobile?: string | null
          nickName?: string | null
          signInAt?: string | null
        }
        Update: {
          address?: string | null
          addressDetail?: string | null
          avatarImage?: string | null
          avatarImageName?: string | null
          createdAt?: string | null
          email?: string | null
          id?: string
          isAdmin?: boolean | null
          mainVehicleId?: string | null
          mobile?: string | null
          nickName?: string | null
          signInAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'userInfo_mainVehicleId_fkey'
            columns: ['mainVehicleId']
            referencedRelation: 'vehicles'
            referencedColumns: ['id']
          },
        ]
      }
      vehicleManagement: {
        Row: {
          createdAt: string | null
          destination: string | null
          driveDistance: number | null
          efficient: number | null
          fuelAmount: number
          fuelStationCode: string | null
          fuelStationName: string | null
          id: string
          manageTypeId: string | null
          memo: string | null
          paidAmount: number | null
          stationImage: string | null
          title: string | null
          totalDistance: number | null
          userId: string | null
          vehicleId: string | null
          manageType: SupabaseDataBase.public.Tables.Code
        }
        Insert: {
          createdAt?: string | null
          destination?: string | null
          driveDistance?: number | null
          efficient?: number | null
          fuelAmount?: number | null
          fuelStationCode?: string | null
          fuelStationName?: string | null
          id?: string
          manageTypeId?: string | null
          memo?: string | null
          paidAmount?: number | null
          stationImage?: string | null
          title?: string | null
          totalDistance?: number | null
          userId?: string | null
          vehicleId?: string | null
        }
        Update: {
          createdAt?: string | null
          destination?: string | null
          driveDistance?: number | null
          efficient?: number | null
          fuelAmount?: number | null
          fuelStationCode?: string | null
          fuelStationName?: string | null
          id?: string
          manageTypeId?: string | null
          memo?: string | null
          paidAmount?: number | null
          stationImage?: string | null
          title?: string | null
          totalDistance?: number | null
          userId?: string | null
          vehicleId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vehicleManagement_manageTypeId_fkey'
            columns: ['manageTypeId']
            referencedRelation: 'manageType'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicleManagement_userId_fkey'
            columns: ['userId']
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicleManagement_vehicleId_fkey'
            columns: ['vehicleId']
            referencedRelation: 'vehicles'
            referencedColumns: ['id']
          },
        ]
      }
      vehicleModel: {
        Row: {
          createdAt: string | null
          id: string
          manufacturerId: string | null
          name: string | null
          years: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: string
          manufacturerId?: string | null
          name?: string | null
          years?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string
          manufacturerId?: string | null
          name?: string | null
          years?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vehicleModel_manufacturerId_fkey'
            columns: ['manufacturerId']
            referencedRelation: 'manufacturer'
            referencedColumns: ['id']
          },
        ]
      }
      vehicles: {
        Row: {
          bikeImage: string | null
          bikeImageName: string | null
          carNickName: string | null
          carNumber: string | null
          createdAt: string | null
          currentFuelAmount: number | null
          displacement: number | null
          fuelTypeId: string | null
          id: string
          insureceId: string | null
          makeYear: string | null
          manualModelName: string | null
          manufacturerId: string | null
          memo: string | null
          officialFuelEfficient: number | null
          plateHeadText: string | null
          plateMiddleText: string | null
          plateNumber: string | null
          plateTailText: string | null
          tankSize: number | null
          tireTypeId: string | null
          totalDistance: number | null
          totalEfficient: number | null
          totalFuelAmount: number | null
          totalPaidAmount: number | null
          userId: string | null
          vehicleModelId: string | null
        }
        Insert: {
          bikeImage?: string | null
          bikeImageName?: string | null
          carNickName?: string | null
          carNumber?: string | null
          createdAt?: string | null
          currentFuelAmount?: number | null
          displacement?: number | null
          fuelTypeId?: string | null
          id?: string
          insureceId?: string | null
          makeYear?: string | null
          manualModelName?: string | null
          manufacturerId?: string | null
          memo?: string | null
          officialFuelEfficient?: number | null
          plateHeadText?: string | null
          plateMiddleText?: string | null
          plateNumber?: string | null
          plateTailText?: string | null
          tankSize?: number | null
          tireTypeId?: string | null
          totalDistance?: number | null
          totalEfficient?: number | null
          totalFuelAmount?: number | null
          totalPaidAmount?: number | null
          userId?: string | null
          vehicleModelId?: string | null
        }
        Update: {
          bikeImage?: string | null
          bikeImageName?: string | null
          carNickName?: string | null
          carNumber?: string | null
          createdAt?: string | null
          currentFuelAmount?: number | null
          displacement?: number | null
          fuelTypeId?: string | null
          id?: string
          insureceId?: string | null
          makeYear?: string | null
          manualModelName?: string | null
          manufacturerId?: string | null
          memo?: string | null
          officialFuelEfficient?: number | null
          plateHeadText?: string | null
          plateMiddleText?: string | null
          plateNumber?: string | null
          plateTailText?: string | null
          tankSize?: number | null
          tireTypeId?: string | null
          totalDistance?: number | null
          totalEfficient?: number | null
          totalFuelAmount?: number | null
          totalPaidAmount?: number | null
          userId?: string | null
          vehicleModelId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vehicles_fuelTypeId_fkey'
            columns: ['fuelTypeId']
            referencedRelation: 'fuelData'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicles_manufacturerId_fkey'
            columns: ['manufacturerId']
            referencedRelation: 'manufacturer'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicles_userId_fkey'
            columns: ['userId']
            referencedRelation: 'userInfo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicles_vehicleModelId_fkey'
            columns: ['vehicleModelId']
            referencedRelation: 'vehicleModel'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
