package com.sujitha304.habits

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import org.json.JSONObject
import android.view.View
import android.app.PendingIntent
import android.content.Intent
import android.util.Log


/**
 * Implementation of App Widget functionality.
 */
class UpcomingHabits : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // There may be multiple widgets active, so update all of them
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Enter relevant functionality for when the first widget is created
    }

    override fun onDisabled(context: Context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    try {
        val sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE)
        val defaultJson = context.getString(R.string.widget_default_json)
            
        val appString = sharedPref.getString("appData", defaultJson)
        
        // Log the raw JSON string
        Log.d("UpcomingHabits", "Raw JSON: $appString")
        
        val appData = JSONObject(appString)
        
        // Log the parsed values
        Log.d("UpcomingHabits", """
            Parsed JSON values:
            title: ${appData.optString("title")}
            task: ${appData.optString("task")}
            time: ${appData.optString("time")}
        """.trimIndent())

        val views = RemoteViews(context.packageName, R.layout.upcoming_habits)

        // Create an Intent to launch the main activity
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Set the pending intent to the root layout
        views.setOnClickPendingIntent(R.id.widget_layout, pendingIntent)

        views.setTextViewText(R.id.widget_title, appData.getString("title"))
        
        // Handle task visibility
        val task = appData.getString("task")
        views.setTextViewText(R.id.widget_task, task)
        views.setViewVisibility(R.id.widget_task, if (task.isNullOrEmpty()) View.INVISIBLE else View.VISIBLE)
        
        // Handle time visibility
        val time = appData.getString("time")
        views.setTextViewText(R.id.widget_time, time)
        views.setViewVisibility(R.id.widget_time, if (time.isNullOrEmpty()) View.INVISIBLE else View.VISIBLE)

        appWidgetManager.updateAppWidget(appWidgetId, views)
    } catch (e: Exception) {
        // Log any errors that occur during JSON parsing
        Log.e("UpcomingHabits", "Error updating widget", e)
        e.printStackTrace()
    }
}