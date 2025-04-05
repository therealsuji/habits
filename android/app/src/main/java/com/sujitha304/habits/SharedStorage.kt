package com.sujitha304.habits

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class SharedStorage(var context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName(): String {
        return "SharedStorage"
    }

    @ReactMethod
    fun set(message: String?) {
        val editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit()
        editor.putString("appData", message)
        editor.commit()

        val intent = Intent(
            currentActivity!!.applicationContext,
            UpcomingHabits::class.java
        )
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
        val ids =
            AppWidgetManager.getInstance(currentActivity!!.applicationContext).getAppWidgetIds(
                ComponentName(
                    currentActivity!!.applicationContext,
                    UpcomingHabits::class.java
                )
            )
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        currentActivity!!.applicationContext.sendBroadcast(intent)
    }
}